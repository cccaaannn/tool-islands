const baseUrl = import.meta.env.BASE_URL;

const get = (item: string) => {
    return `${baseUrl}${item}`;
}

const getLogo = (logo: string) => {
    return `${baseUrl}logos/${logo}.svg`;
}

const ResourceUtils = {
    get,
    getLogo
};

export default ResourceUtils;
