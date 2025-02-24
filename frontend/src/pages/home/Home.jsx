import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import NoteBlock from '../../components/Blocks/NoteCard'
import { MdAdd } from 'react-icons/md'
import EditNotes from './EditNotes'
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utilites/axiosInstance'
import Toast from '../../components/toast/Toast'
import EmptyCard from '../../components/empty-card/EmptyCard'
import AddNotesImg from "../../assets/images/add-note.png"
import NoDataImg from "../../assets/images/note.png"



const Home = () => {

  const [openAddEditModal, SetOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSerach] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    SetOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // get notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error. Try later")
    }
  };

  //delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Deleted Successfully", 'delete');
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("Error Occured")
      }
    }
  };

  // search notes
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSerach(ture)
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error. Try later")
    }
  };

  // update note
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
        isPinned: !noteId.isPinned,
      });

      if (response.data && response.data.note) {
        showToastMessage("Updated Successfully")
        getAllNotes()

      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSerach(false);
    getAllNotes();
  }

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => { };
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

      <div className='container mx-auto'>
        {
          allNotes.length > 0 ? (
            <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-4 p-4 mt-8'>
              {allNotes.map((item, index) => (
                <NoteBlock
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPin={() => updateIsPinned(item)}
                />))}
            </div>
          ) : (
            <EmptyCard imgSrc={isSearch ? NoDataImg : AddNotesImg} message={isSearch ? `No Notes found` : `Start Creating your note! just click on '+' button`} />
          )}
      </div>
      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10 '
        onClick={() => {
          SetOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}>
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.49)",
          },
        }}
        contentLabel=""
        className="w-100 bg-white rounded-md mx-auto mt-14 px-8 py-6 overflow-none outline-none" >

        <EditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            SetOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home;