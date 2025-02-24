import React from 'react'
import moment from 'moment'
import { MdOutlinePushPin } from 'react-icons/md'
import { MdCreate, MdDelete } from 'react-icons/md'


const NoteBlock = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote, }) => {
    return (
        <>
            <div className='border-1 border-gray-300 rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h6 className='text-lg font-medium'>{title}</h6>
                        <span className='text-xs text-slate-600'>{moment(date).format('Do MMM YYYY')}</span>
                    </div>
                    <MdOutlinePushPin className={`icon-bnt ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />
                </div>

                <p className='mt-1'>{content?.slice(0, 60)}</p>

                <div className='mt-2'>
                    <div className='text-xs text-slate-500'>{tags.map((item) => `#${item} `)}</div>

                    <div className='mt-2 flex items-center'>
                        <MdCreate className='text-lg text-slate-400 icon-btn hover:text-green-600' onClick={onEdit} />

                        <MdDelete className='text-lg text-slate-400 ml-2 icon-btn hover:text-red-500' onClick={onDelete} />
                    </div>
                </div>
            </div>

        </>
    )
}

export default NoteBlock