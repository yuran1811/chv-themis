const signOut = document.querySelector('.sign-out');
signOut.addEventListener('click', () => {
  document.cookie = 'isAuth=;';
  document.cookie = 'user=;';
});
