const DADOS_CRIPTOGRAFAR = {
    SECRET_ALGORITHM : "aes256",
    SECRET_KEY : "chaves",
    SECRET_TYPE : "hex"
};

module.exports = function (text) {
    const cipher = crypto.createCipher(SECRET_ALGORITHM, SECRET_KEY);
    cipher.update(text);
    return cipher.final(SECRET_TYPE);
}

 
