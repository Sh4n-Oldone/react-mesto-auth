import React, {useEffect, useState} from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import myApi from "../utils/api";
import avatar from '../images/cousteau.jpg';
import CurrentUserContext from "../context/CurrentUserContext";
import CardsContext from "../context/CardsContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

export default function App() {

  const [popupsState, popupsSetState] = useState({
    isEditProfilePopupOpen: false,
    isAddPlacePopupOpen: false,
    isEditAvatarPopupOpen: false,
    isRemoveCardPopupOpen: false
  })
  const [selectedCard, setSelectedCard] = useState('')
  const [currentUser, setCurrentUser] = useState({
    name: 'Жак-Ив Кусто',
    description: 'Исследователь океана',
    avatar: avatar,
    _id: 0
  })
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([
      myApi.getUserData(),
      myApi.getCardsData()
    ])
      .then((res) => {
        const [profileData, cardsData] = res;
        setCurrentUser({
          name: profileData.name,
          description: profileData.about,
          avatar: profileData.avatar,
          _id: profileData._id
        });
        setCards(cardsData);
      })
      .catch((error) => {
        console.log('Я получал данные о профиле и карточках. Я сломался. Ошибка: ' + error)
      })
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    myApi.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        setCards(newCards);
      })
      .catch((error) => {
        console.log('Я работал с лайком. Я сломался. Ошибка: ' + error)
      });
  }

  function handleCardDelete(card) {
    myApi.removeCard(card._id)
      .then(() => {
        const newCards = cards.filter(item => card._id !== item._id);
        setCards(newCards);
      })
      .catch((error) => {
        console.log('Я удалял карточку. Я сломался. Ошибка: ' + error)
      });
  }

  function handleUpdateUser(data) {
    myApi.setUserData(data)
      .then((res) => {
        setCurrentUser({
          name: res.name,
          description: res.about,
          avatar: res.avatar,
          _id: res._id
        })
      })
      .catch((error) => {
        console.log('Я менял данные пользователя. Я сломался. Ошибка: ' + error)
      })
      .then(() => {closeAllPopups()});
  }

  function handleUpdateAvatar(data) {
    myApi.setNewAvatar(data)
      .then((res) => {
        setCurrentUser({
          name: currentUser.name,
          description: currentUser.description,
          avatar: res.avatar,
          _id: currentUser._id
        })
      })
      .catch((error) => {
        console.log('Я отправлял новый аватар. Я сломался. Ошибка: ' + error)
      })
      .then(() => {closeAllPopups()});
  }

  function handleAddPlaceSubmit(data) {
    myApi.setCardsData(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((error) => {
        console.log('Я добавлял новую карточку. Я сломался. Ошибка: ' + error)
      })
      .then(() => {closeAllPopups()});
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditProfileClick() {
    popupsSetState({...popupsState, isEditProfilePopupOpen: !popupsState.isEditProfilePopupOpen})
  }

  function handleAddPlaceClick() {
    popupsSetState({...popupsState, isAddPlacePopupOpen: !popupsState.isAddPlacePopupOpen})
  }

  function handleEditAvatarClick() {
    popupsSetState({...popupsState, isEditAvatarPopupOpen: !popupsState.isEditAvatarPopupOpen})
  }

  function handleRemoveCardClickPopupOpen() {
    popupsSetState({...popupsState, isRemoveCardPopupOpen: !popupsState.isRemoveCardPopupOpen})
  }

  function closeAllPopups() {
    popupsSetState({
      ...popupsState, isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isRemoveCardPopupOpen: false
    });
    setSelectedCard('')
  }

  return (
    <div className='App'>
      <div className='page'>
        <div className='page__container'>

          <CurrentUserContext.Provider value={currentUser}>
            <CardsContext.Provider value={cards}>

              <Header/>

              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onRemoveClickPopup={handleRemoveCardClickPopupOpen}
                onLikeClick={handleCardLike}
                onDeleteClick={handleCardDelete}
              />

              <EditProfilePopup
                isOpen={popupsState.isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
              />

              <EditAvatarPopup
                isOpen={popupsState.isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
              />

              <AddPlacePopup
                isOpen={popupsState.isAddPlacePopupOpen}
                onClose={closeAllPopups}
                handleNewPlace={handleAddPlaceSubmit}
              />

              <PopupWithForm
                name={'submit'}
                title={'Вы уверены?'}
                isOpen={popupsState.isRemoveCardPopupOpen}
                onClose={closeAllPopups}
              />

              <ImagePopup
                card={selectedCard}
                name={'image'}
                onClose={closeAllPopups}
              >
              </ImagePopup>

              <Footer/>

            </CardsContext.Provider>
          </CurrentUserContext.Provider>


        </div>
      </div>
    </div>
  );

}

