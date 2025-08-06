import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

// Get the path to the bst root directory (parent of web)
const BST_ROOT = path.resolve(process.cwd(), '..')

export async function GET() {
  try {
    // Try to read the protocol file directly
    const fs = require('fs').promises
    const protocolPath = path.join(BST_ROOT, 'protocol', 'demo_protocol.yaml')
    
    try {
      const content = await fs.readFile(protocolPath, 'utf-8')
      return NextResponse.json({
        content,
        path: protocolPath,
        exists: true
      })
    } catch (error) {
      return NextResponse.json({
        content: '',
        path: protocolPath,
        exists: false,
        error: 'Protocol file not found'
      })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read protocol' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Write the protocol file
    const fs = require('fs').promises
    const protocolPath = path.join(BST_ROOT, 'protocol', 'demo_protocol.yaml')
    
    await fs.writeFile(protocolPath, content, 'utf-8')
    
    // Try to add it via bst CLI (if available)
    try {
      const { stdout, stderr } = await execAsync(`cd "${BST_ROOT}" && bst add-protocol protocol/demo_protocol.yaml`)
      console.log('BST output:', stdout)
      if (stderr) console.error('BST stderr:', stderr)
    } catch (cliError) {
      console.warn('BST CLI not available or failed:', cliError)
      // Continue anyway - we still saved the file
    }

    return NextResponse.json({
      success: true,
      message: 'Protocol saved',
      path: protocolPath
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save protocol' },
      { status: 500 }
    )
  }
}