import slugify from 'slugify';

// config
const slugifyOptions = {
    replacement: '-',
    lower: true,
    strict: true
}

export const generateSlug = (name) => {
    return slugify(name, slugifyOptions);
}
