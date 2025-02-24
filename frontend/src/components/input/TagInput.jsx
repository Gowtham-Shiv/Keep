import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const TagInput = ({ tags, setTags }) => {

    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addNewTag = () => {
        if (inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addNewTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <>
            {tags?.length > 0 && (
                <div className=' gap-2 flex-wrap mt-2'>
                    {tags.map((tag, index) => (
                        <span key={index} className='flex items-center inline-flex shrink-0 rounded-full text-sm border border-blue-300 bg-blue-100 p-2 dark:border-blue-300/10 dark:bg-blue-400/10'>
                            #{tag}
                            <button className='ml-1' onClick={() => { handleRemoveTag(tag) }}>
                                <MdClose />
                            </button>
                        </span>
                    ))}
                </div>)}

            <div className='flex items-center gap-4 mt-3'>
                <input type="text"
                    value={inputValue}
                    className='px-3 rounded w-full text-sm text-slate-950 bg-slate-50 py-3 mr-3 rounded outline-none'
                    placeholder='add tags'
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button className='w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700'
                    onClick={() => {
                        addNewTag();
                    }}
                >
                    <MdAdd className='text-2xl text-blue-700 hover:text-white ' />
                </button>
            </div>
        </>
    )
}

export default TagInput;