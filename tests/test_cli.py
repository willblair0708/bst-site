"""Test CLI functionality."""

import tempfile
import pathlib
from click.testing import CliRunner
from bst.cli import cli


def test_init_command():
    """Test bst init creates proper structure."""
    runner = CliRunner()
    
    with tempfile.TemporaryDirectory() as tmpdir:
        with runner.isolated_filesystem(temp_dir=tmpdir):
            result = runner.invoke(cli, ['init', '--indication', 'NSCLC'])
            
            assert result.exit_code == 0
            assert pathlib.Path('.ctrepo').exists()
            assert pathlib.Path('bastion.yaml').exists()
            assert pathlib.Path('protocol').exists()
            assert pathlib.Path('schemas').exists()


def test_add_protocol_validation():
    """Test protocol validation works."""
    runner = CliRunner()
    
    with tempfile.TemporaryDirectory() as tmpdir:
        with runner.isolated_filesystem(temp_dir=tmpdir):
            # Init repo first
            runner.invoke(cli, ['init', '--indication', 'NSCLC'])
            
            # Create invalid protocol
            invalid_yaml = """
title: Missing ID
version: v1.0
inclusionCriteria: []
"""
            pathlib.Path('invalid.yaml').write_text(invalid_yaml)
            
            result = runner.invoke(cli, ['add-protocol', 'invalid.yaml'])
            assert result.exit_code == 1
            assert 'validation failed' in result.output.lower()


def test_twin_simulate():
    """Test twin simulation command."""
    runner = CliRunner()
    
    with tempfile.TemporaryDirectory() as tmpdir:
        with runner.isolated_filesystem(temp_dir=tmpdir):
            # Init repo first
            runner.invoke(cli, ['init', '--indication', 'NSCLC'])
            
            result = runner.invoke(cli, ['twin-simulate', '--n', '50'])
            
            assert result.exit_code == 0
            assert pathlib.Path('data/synthetic-controls.parquet').exists()