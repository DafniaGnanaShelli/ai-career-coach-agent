import { Handle, Position } from '@xyflow/react'
import Link from 'next/link';
import React from 'react'

function TurboNode({ data }: any) {
    return (
        <div className='rounded-lg border border-gray-300 bg-yellow-100 shadow-md w-64 p-5'>
            <div className='font-bold text-lg text-gray-800 '>
                {data.title || 'Untitled Node'}
            </div>
            <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{data.description || 'No description available'}</p>
            {data?.link && (
                <Link
                    href={data.link}
                    target='_blank'
                    className='text-blue-600 underline text-sm mt-2 inline-block'
                >
                    Learn More
                </Link>
            )}
            <Handle
                type='target'
                position={Position.Top}
                id="input"
                className="w-3 h-3 bg-gray-400 border-2 border-white"
            />

            <Handle type='source' position={Position.Bottom}
                id="output"
                style={{
                    width: '12px',
                    height: '12px',
                    background: '#6b7280',
                    border: '2px solid white'
                }} />

        </div>
    )
}

export default TurboNode
