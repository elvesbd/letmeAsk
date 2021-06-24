import { useState } from 'react';
import Modal from 'react-modal';
import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import Button from '../components/Button';
import Question from '../components/Question';
import RoomCode from '../components/RoomCode';

import useRoom from '../hooks/useRoom';

import { database } from '../services/firebase';

import '../styles/room.scss';
import ConfirmDeletedModal from '../components/ConfirmDeletedModal';

type RoomParams = {
  id: string;
}

Modal.setAppElement('#root');


export default function AdminRoom() {
  const [isDeletedQuestionModal, setIsNewQuestionModal] = useState(false);

  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id
  const { questions, title } = useRoom(roomId);

  function handleOpenQuestionModal() {
    setIsNewQuestionModal(true);
  };

  function handleCloseQuestionModal() {
    setIsNewQuestionModal(false);
  };

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });
    history.push('/');
  };

  async function handleDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask"/>
          <div>
            <RoomCode code={roomId}/>
            <Button onClick={handleEndRoom} isOutlined>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 1 
            ? (<span>{questions.length} perguntas</span>) 
            : (<span>{questions.length} pergunta</span>)
          }
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <>
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                >
                  <button
                    type='button'
                    onClick={handleOpenQuestionModal}
                  >
                    <img 
                      src={deleteImg}
                      alt="Remover pergunta"
                    />
                  </button>
                </Question>
                <ConfirmDeletedModal
                  isOpen={isDeletedQuestionModal}
                  onRequestClose={handleCloseQuestionModal}
                  isDeleted={() => handleDeleteQuestion(question.id)}
                />
              </>
            )
          })}
        </div>
      </main>
    </div> 
  );
};