/**
 * Created by mihelcic on 27. 08. 2016.
 */

console.log('im alive!')

document.querySelector('.screen-header').addEventListener('click', () => {
  window.location.reload()
})

const card = new Card()