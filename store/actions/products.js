export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export const deleteProduct = (productId) => {
    return {type: DELETE_PRODUCT, id: productId}
};

export const createProduct = (title, imageUrl, price, description) => {
    return {
        type: CREATE_PRODUCT, 
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
    }
}

export const updateProduct = (id, title, imageUrl, price, description) => {
    return {
        type: UPDATE_PRODUCT, 
        id: id,
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
    }
}