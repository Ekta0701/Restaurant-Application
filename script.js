// Constantes
const images = 'images/';
let pizzaJson = [
    {id:1, name:'Noodles', img:'images/noodles.png', price:[60.00], sizes:['180g'], description:'Cheese noodles with capsicum'},
    {id:2, name:'Manchurian', img:'images/manchurian.jfif', price:[70.00], sizes:['320g'], description:'Veg Manchurian'},
    {id:3, name:'Dosa', img:'images/dosa.jfif', price:[120.00], sizes:['320g'], description:'plain/chesse dosa with sambar and chutney'},
    {id:4, name:'Chana Bhatura', img:'images/chana.jfif', price:[180.00], sizes:['320g'], description:'Special chana bhatura with curd and chutney'},
    {id:5, name:'Pizza', img:'images/pizza.png', price:[210.00], sizes:['320g'], description:'Farm house pizza'},
    {id:6, name:' Fresh salad', img:'images/salad.jfif', price:[60.00], sizes:['320g'], description:' Healthy Fresh salad'},
    {id:7, name:'Samosa', img:'images/samosa.jfif', price:[20.00], sizes:['320g'], description:'Aloo/Noodle samosa with chutney'}
];
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
const price = (el) => el.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

let modalQt = 1;
let cart = [];
let modalKey = 0;

pizzaJson.map((item, index)=>{

    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    pizzaItem.setAttribute('data-index', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--priceP').innerHTML = 'Rs '+item.price[0];
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML ='Rs ' + item.price[0];  
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
        });
        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
    });

    c('.pizza-area').append( pizzaItem );
});
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
         c('.pizzaInfo--size.selected').classList.remove('selected');
         size.classList.add('selected');
         let tamanho = size.getAttribute('data-key');
         c('.pizzaInfo--actualPrice').innerHTML = pizzaJson[modalKey].price[tamanho];
    });
});
document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item)=>item.identifier == identifier);

        if(key > -1) {
            cart[key].qt += modalQt;
        } else {

    cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
    });
        }

    updateCart();

    closeModal();

});

document.querySelector('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});
    function updateCart() {

        document.querySelector('.menu-openner span').innerHTML = cart.length;

        if(cart.length > 0){
            document.querySelector('aside').classList.add('show');
            c('.cart').innerHTML = '';

            let subtotal = 0;
            let discount = 0;
            let total = 0;

            for(let i in cart) {

                let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
                 
                let pizzaPrice = pizzaItem.price[0];

                subtotal += pizzaPrice * cart[i].qt;

                let cartItem = c('.models .cart--item').cloneNode(true);

                let pizzaSizeName;
                cart[i].size;
                let pizzaName = `${pizzaItem.name}`;
                cartItem.querySelector('img').src = pizzaItem.img;
                cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
                cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                    if(cart[i].qt > 1) {
                        cart[i].qt--;
                    } else {
                        cart.splice(i, 1);
                    }
                    updateCart();
                });
                cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                    cart[i].qt++;
                    updateCart();
                });

                c('.cart').append(cartItem);

                };

                discount = subtotal * 0.1;
                total = subtotal - discount;

                document.querySelector('.subtotal span:last-child').innerHTML ='Rs '+ subtotal;; 
                document.querySelector('.discount span:last-child').innerHTML ='Rs ' +discount;;
                document.querySelector('.total span:last-child').innerHTML = 'Rs '+total;
            }
        else {
            document.querySelector('aside').classList.remove('show');
            document.querySelector('aside').style.left = '100vw';
        }
    }



    