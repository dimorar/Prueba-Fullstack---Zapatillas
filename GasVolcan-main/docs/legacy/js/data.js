const initialProducts = [
    { id: 'G-05', name: 'Gas 5Kg',  price: 10500, stock: 15, stockCritico: 5, img: 'img/gas-5kg.svg' },
    { id: 'G-11', name: 'Gas 11Kg', price: 16800, stock: 3,  stockCritico: 5, img: 'img/gas-11kg.svg' },
    { id: 'G-15', name: 'Gas 15Kg', price: 21500, stock: 20, stockCritico: 5, img: 'img/gas-15kg.svg' },
    { id: 'G-45', name: 'Gas 45Kg', price: 62000, stock: 2,  stockCritico: 3, img: 'img/gas-45kg.svg' }
];

const DATA_VERSION = '2';
if (localStorage.getItem('productsVersion') !== DATA_VERSION) {
    localStorage.setItem('products', JSON.stringify(initialProducts));
    localStorage.setItem('productsVersion', DATA_VERSION);
}
