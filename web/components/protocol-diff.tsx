"use client"

import React from 'react';
import { Diff, Hunk, parseDiff } from 'react-diff-view';
import 'react-diff-view/style/index.css';

interface ProtocolDiffProps {
  oldProtocol: string;
  newProtocol: string;
  patch: string;
}

const ProtocolDiff: React.FC<ProtocolDiffProps> = ({ patch }) => {
  const files = parseDiff(patch);

  if (!files || files.length === 0) {
    return <div className="p-4 text-gray-500">No changes to display.</div>;
  }

  return (
    <div className="font-mono text-sm">
      {files.map(({ oldRevision, newRevision, type, hunks }) => (
        <Diff key={oldRevision + '-' + newRevision} viewType="split" diffType={type} hunks={hunks}>
          {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
        </Diff>
      ))}
    </div>
  );
};

export default ProtocolDiff;