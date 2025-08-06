#!/usr/bin/env python3
"""
Bastion Clinical Trial Repository (CTRepo) Server

Git-compatible hosting server for clinical trial protocols, supporting:
- Standard Git operations (clone, push, pull, fetch)
- Clinical trial specific hooks and validation
- Protocol version management
- Compliance audit trails
- Integration with Evidence Engine CI/CD
"""

import os
import git
import shutil
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
from flask import Flask, request, jsonify, abort
from werkzeug.exceptions import BadRequest, NotFound, Unauthorized
import yaml
import json
from datetime import datetime
import hashlib

# Bastion imports
from bst.transpiler import ProtocolTranspiler, TranspilerConfig

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CTRepoServer:
    """Clinical Trial Repository Server with Git compatibility."""
    
    def __init__(self, repo_root: str = "/var/ctrepos"):
        self.repo_root = Path(repo_root)
        self.repo_root.mkdir(parents=True, exist_ok=True)
        
        # Load transpiler for protocol validation
        self.transpiler_config = TranspilerConfig(
            schema_path=Path("schemas/protocol.schema.json"),
            output_dir=Path("/tmp/ctrepo_validation"),
            include_tests=True,
            include_validation=True,
            include_simulation=True
        )
        self.transpiler = ProtocolTranspiler(self.transpiler_config)
        
        logger.info(f"CTRepo server initialized with root: {self.repo_root}")
    
    def create_repository(self, repo_name: str, creator: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new clinical trial repository."""
        repo_path = self.repo_root / f"{repo_name}.ctrepo"
        
        if repo_path.exists():
            raise ValueError(f"Repository {repo_name} already exists")
        
        # Initialize bare Git repository
        repo = git.Repo.init(repo_path, bare=True)
        
        # Create repository metadata
        repo_metadata = {
            "name": repo_name,
            "creator": creator,
            "created_at": datetime.utcnow().isoformat(),
            "type": "clinical_trial",
            "compliance": metadata.get("compliance", {}),
            "phase": metadata.get("phase"),
            "sponsor": metadata.get("sponsor"),
            "pi": metadata.get("principal_investigator"),
            "status": "active"
        }
        
        # Store metadata
        metadata_path = repo_path / "bastion.json"
        with open(metadata_path, 'w') as f:
            json.dump(repo_metadata, f, indent=2)
        
        # Install Git hooks for protocol validation
        self._install_hooks(repo_path)
        
        logger.info(f"Created clinical trial repository: {repo_name}")
        return repo_metadata
    
    def _install_hooks(self, repo_path: Path):
        """Install Git hooks for protocol validation and compliance."""
        hooks_dir = repo_path / "hooks"
        
        # Pre-receive hook for protocol validation
        pre_receive_hook = hooks_dir / "pre-receive"
        pre_receive_content = '''#!/bin/bash
# Bastion CTRepo Pre-Receive Hook
# Validates protocol changes before accepting push

while read oldrev newrev refname; do
    echo "Validating protocol changes in $refname..."
    
    # Check if protocol.yaml was modified
    if git diff --name-only $oldrev..$newrev | grep -q "protocol\\.yaml"; then
        echo "Protocol changes detected, running validation..."
        
        # Extract protocol.yaml from the new commit
        git show $newrev:protocol.yaml > /tmp/protocol_temp.yaml
        
        # Run protocol validation
        python3 /opt/bastion/hooks/validate_protocol.py /tmp/protocol_temp.yaml
        
        if [ $? -ne 0 ]; then
            echo "ERROR: Protocol validation failed"
            echo "Push rejected due to invalid protocol"
            exit 1
        fi
        
        echo "Protocol validation passed"
    fi
done

echo "All validations passed, accepting push"
exit 0
'''
        with open(pre_receive_hook, 'w') as f:
            f.write(pre_receive_content)
        pre_receive_hook.chmod(0o755)
        
        # Post-receive hook for triggering Evidence Engine CI/CD
        post_receive_hook = hooks_dir / "post-receive"
        post_receive_content = '''#!/bin/bash
# Bastion CTRepo Post-Receive Hook  
# Triggers Evidence Engine CI/CD pipeline

while read oldrev newrev refname; do
    echo "Processing push to $refname..."
    
    # Extract repository name
    REPO_NAME=$(basename $(pwd) .ctrepo)
    
    # Trigger Evidence Engine pipeline
    curl -X POST http://evidence-engine:8080/api/v1/triggers/protocol-update \\
         -H "Content-Type: application/json" \\
         -d "{
               \"repository\": \"$REPO_NAME\", 
               \"commit\": \"$newrev\",
               \"ref\": \"$refname\",
               \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
             }"
    
    echo "Evidence Engine pipeline triggered for $REPO_NAME"
done
'''
        with open(post_receive_hook, 'w') as f:
            f.write(post_receive_content)
        post_receive_hook.chmod(0o755)
        
        logger.info(f"Installed Git hooks in {repo_path}")
    
    def list_repositories(self, user: Optional[str] = None) -> List[Dict[str, Any]]:
        """List available clinical trial repositories."""
        repos = []
        
        for repo_dir in self.repo_root.glob("*.ctrepo"):
            try:
                metadata_path = repo_dir / "bastion.json"
                if metadata_path.exists():
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                    
                    # Add computed fields
                    repo = git.Repo(repo_dir)
                    try:
                        last_commit = repo.head.commit
                        metadata['last_updated'] = last_commit.committed_datetime.isoformat()
                        metadata['last_commit'] = last_commit.hexsha[:8]
                    except:
                        metadata['last_updated'] = metadata['created_at']
                        metadata['last_commit'] = None
                    
                    repos.append(metadata)
            except Exception as e:
                logger.warning(f"Error reading repository {repo_dir}: {e}")
        
        # Filter by user if specified
        if user:
            repos = [r for r in repos if r.get('creator') == user or user in r.get('collaborators', [])]
        
        return sorted(repos, key=lambda x: x['created_at'], reverse=True)
    
    def get_repository_info(self, repo_name: str) -> Dict[str, Any]:
        """Get detailed information about a repository."""
        repo_path = self.repo_root / f"{repo_name}.ctrepo"
        
        if not repo_path.exists():
            raise NotFound(f"Repository {repo_name} not found")
        
        # Load metadata
        metadata_path = repo_path / "bastion.json"
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        # Add Git information
        repo = git.Repo(repo_path)
        branches = [ref.name.split('/')[-1] for ref in repo.references if ref.name.startswith('refs/heads/')]
        tags = [tag.name for tag in repo.tags]
        
        # Get recent commits
        commits = []
        try:
            for commit in repo.iter_commits('HEAD', max_count=10):
                commits.append({
                    'sha': commit.hexsha[:8],
                    'message': commit.message.strip(),
                    'author': commit.author.name,
                    'date': commit.committed_datetime.isoformat()
                })
        except:
            pass  # Repository might be empty
        
        metadata.update({
            'branches': branches,
            'tags': tags,
            'recent_commits': commits,
            'clone_url': f"https://ctrepo.bastion.health/{repo_name}.git"
        })
        
        return metadata
    
    def validate_protocol_update(self, repo_name: str, protocol_content: str) -> Dict[str, Any]:
        """Validate a protocol update before committing."""
        try:
            # Parse YAML
            protocol = yaml.safe_load(protocol_content)
            
            # Validate against schema
            is_valid = self.transpiler.validate_protocol(protocol)
            
            result = {
                'valid': is_valid,
                'protocol_id': protocol.get('meta', {}).get('id'),
                'version': protocol.get('meta', {}).get('version'),
                'timestamp': datetime.utcnow().isoformat()
            }
            
            if is_valid:
                # Generate compliance hash for audit trail
                compliance_hash = hashlib.sha256(protocol_content.encode()).hexdigest()
                result['compliance_hash'] = compliance_hash
                
                # Check for breaking changes
                result['breaking_changes'] = self._check_breaking_changes(repo_name, protocol)
            
            return result
            
        except Exception as e:
            return {
                'valid': False,
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def _check_breaking_changes(self, repo_name: str, new_protocol: Dict[str, Any]) -> List[str]:
        """Check for breaking changes in protocol update."""
        breaking_changes = []
        
        try:
            # Get current protocol from repository
            repo_path = self.repo_root / f"{repo_name}.ctrepo"
            repo = git.Repo(repo_path)
            
            try:
                current_protocol_content = repo.git.show('HEAD:protocol.yaml')
                current_protocol = yaml.safe_load(current_protocol_content)
                
                # Check for changes that require amendment
                if new_protocol['meta']['id'] != current_protocol['meta']['id']:
                    breaking_changes.append("Protocol ID changed - requires new protocol")
                
                if new_protocol['population']['target_size'] != current_protocol['population']['target_size']:
                    breaking_changes.append("Target enrollment changed - may require amendment")
                
                if new_protocol['endpoints']['primary'] != current_protocol['endpoints']['primary']:
                    breaking_changes.append("Primary endpoints changed - requires substantial amendment")
                
                # Check inclusion/exclusion criteria changes
                old_inclusion = set(current_protocol['population']['inclusion'])
                new_inclusion = set(new_protocol['population']['inclusion'])
                if old_inclusion != new_inclusion:
                    breaking_changes.append("Inclusion criteria changed - may require amendment")
                
            except git.exc.GitCommandError:
                # Repository is empty or no protocol.yaml exists yet
                pass
                
        except Exception as e:
            logger.warning(f"Error checking breaking changes: {e}")
        
        return breaking_changes

# Initialize global CTRepo server instance
ctrepo_server = CTRepoServer()

# Flask API endpoints
@app.route('/api/v1/repositories', methods=['GET'])
def list_repositories():
    """List all clinical trial repositories."""
    user = request.args.get('user')
    repos = ctrepo_server.list_repositories(user=user)
    return jsonify({'repositories': repos})

@app.route('/api/v1/repositories', methods=['POST'])
def create_repository():
    """Create a new clinical trial repository."""
    data = request.get_json()
    
    if not data or 'name' not in data:
        abort(400, "Repository name is required")
    
    try:
        repo_metadata = ctrepo_server.create_repository(
            repo_name=data['name'],
            creator=data.get('creator', 'unknown'),
            metadata=data.get('metadata', {})
        )
        return jsonify(repo_metadata), 201
    except ValueError as e:
        abort(400, str(e))

@app.route('/api/v1/repositories/<repo_name>', methods=['GET'])
def get_repository(repo_name: str):
    """Get repository information."""
    try:
        repo_info = ctrepo_server.get_repository_info(repo_name)
        return jsonify(repo_info)
    except NotFound:
        abort(404, f"Repository {repo_name} not found")

@app.route('/api/v1/repositories/<repo_name>/validate', methods=['POST'])
def validate_protocol(repo_name: str):
    """Validate a protocol update."""
    data = request.get_json()
    
    if not data or 'protocol' not in data:
        abort(400, "Protocol content is required")
    
    result = ctrepo_server.validate_protocol_update(repo_name, data['protocol'])
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'ctrepo-server',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    # Development server
    app.run(host='0.0.0.0', port=8080, debug=True)