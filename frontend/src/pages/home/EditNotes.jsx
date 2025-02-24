import React, { useState } from 'react'
import TagInput from '../../components/input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utilites/axiosInstance';

const EditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null);

    // add note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags,
            });

            if (response.data && response.data.note) {
                showToastMessage("Added Successfully")
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            }
        }
    };
    // edit note
    const editNote = async () => {
        const noteId = noteData._id;

        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content,
                tags,
            });

            if (response.data && response.data.note) {
                showToastMessage("Updated Successfully")
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message)
            }
        }
    };

    const handleAddNote = () => {
        if (!title) {
            setError("Enter Title");
            return;
        }
        if (!content) {
            setError("Enter Connt");
            return;
        }
        setError('');

        if (type === 'edit') {
            editNote()
        } else {
            addNewNote()
        }
    };
    return (
        <>
            <div className='relative'>
                <button className='flex items-center jusitfy-center absolute -top-3 -right-3 inline-flex shrink-0 rounded-full border border-blue-300 bg-blue-100 p-2 dark:border-blue-300/10 dark:bg-blue-400/10' onClick={onClose} >
                    <MdClose className='tetx-xl' />
                </button>
          <br />

            <div className='flex flex-col gap-2'>
                <label className='text-lg mvb-7'>Title</label>
                <input type="text"
                    className='px-3 rounded w-full text-sm text-slate-950 bg-slate-50 py-3 mr-3 rounded outline-none'
                    placeholder='Type Title...'
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div className='mt-4 flex flex-col gap-2'>
                <label className='text-lg mvb-7'>Content</label>
                <textarea type="text"
                    className='px-3 rounded w-full text-sm text-slate-950 bg-slate-50 py-3 mr-3 rounded outline-none'
                    placeholder='Take a note....'
                    rows={7}
                    value={content} onChange={({ target }) => setContent(target.value)}
                />
            </div>

            <div className='mt-4'>
                <label className='text-lg mvb-7'>Tags</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
            <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleAddNote}>
                {type === 'edit' ? 'Update' : 'Add'}
            </button>
        </div >
        </>
    );
};

export default EditNotes;