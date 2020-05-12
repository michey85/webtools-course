const obj = {
    message: 'message from object',
};

module.exports = () => {
    console.log(obj?.message);
    console.log('webpack works great!');

    document.body.insertAdjacentHTML('beforebegin', '<h1>About</h1>');
};
