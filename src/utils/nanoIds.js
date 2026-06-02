import { customAlphabet } from 'nanoid';


const alphabet = '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
const nanoIdGenerator = customAlphabet(alphabet, 6);

const createIdGenerator = (prefix) => {
    return () => `${prefix}_${nanoIdGenerator()}`;
};

// generadores específicos por modelo (usar nanoid para indexar la búsqueda en la base de datos)
export const generateOrderNumber = createIdGenerator('ord');

// generador para sufijos
const alphabetSufix = '0123456789abcdefghijklmnopqrstuvwxyz';

export const nanoIdSufixGenerator = customAlphabet(alphabetSufix, 5);
