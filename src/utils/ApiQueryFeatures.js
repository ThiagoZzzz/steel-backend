import { Op } from 'sequelize';

// Configuraciones por entidad -> define qué campos acepta el cliente para filtrar, ordenar y buscar

export const PRODUCT_CONFIG = {
    // Campos que se filtran por igualdad exacta: ?category=acero, ?featured=true
    filterFields: ['category', 'discount', 'featured'],
    // Campos que aceptan operadores de rango: ?price[gte]=100&price[lte]=500
    rangeFields: ['price', 'stock'],
    // Campo de búsqueda de texto libre (iLike): ?search=gold
    searchField: 'name',
    // Campos por los que se puede ordenar: ?sort=price o ?sort=-price
    sortFields: ['price', 'stock', 'name', 'created_at'],
    // Orden por defecto si el cliente no especifica
    defaultSort: [['created_at', 'DESC']],
    // Límite de ítems por página si el cliente no especifica
    defaultLimit: 12,
};

export const ORDER_CONFIG = {
    filterFields: ['user_email', 'payment_method', 'state'],
    rangeFields: ['total'],
    searchField: null,
    searchFields: ['user_email', 'order_number'],
    sortFields: ['total', 'created_at'],
    defaultSort: [['created_at', 'DESC']],
    defaultLimit: 20,
};

export const USER_CONFIG = {
    filterFields: ['name', 'last_name', 'email'],
    rangeFields: [],
    searchField: null,
    // Búsqueda iLike en OR sobre múltiples campos: ?search=juan buscará en name, last_name y email
    searchFields: ['name', 'last_name', 'email'],
    sortFields: ['name', 'last_name', 'email', 'created_at'],
    defaultSort: [['created_at', 'DESC']],
    defaultLimit: 20,
};

// query string -> ops sequelize
const OP_MAP = {
    gte: Op.gte,
    gt: Op.gt,
    lte: Op.lte,
    lt: Op.lt,
};

const MAX_LIMIT = 100;

class ApiQueryFeature {
    /**
     * @param {object} queryString - query string
     * @param {object} config      - configuración de la entidad
     */

    constructor(queryString, config) {
        this.queryString = queryString;
        this.config = config;
        this.findOptions = {
            where: {},
            order: config.defaultSort,
        };
    }

    // Aplica filtros exactos y de rango según la whitelist de la config.
    // Soporta: ?category=acero, ?discount=true, ?price[gte]=100&price[lte]=500
    filter() {
        const { filterFields, rangeFields } = this.config;

        // Campos reservados que no deben procesarse como filtros
        const systemFields = new Set(['page', 'sort', 'limit', 'search']);

        for (const [key, value] of Object.entries(this.queryString)) {
            if (systemFields.has(key)) continue;

            // 1. Filtro directo por igualdad: ?category=acero
            if (filterFields.includes(key)) {
                this.findOptions.where[key] =
                    value === 'true' ? true :
                        value === 'false' ? false :
                            value;
                continue;
            }

            // 2. Filtro con operador de rango: ?price[gte]=100
            const match = key.match(/^(\w+)\[(\w+)\]$/);
            if (match) {
                const [, field, operator] = match;
                if (rangeFields.includes(field) && OP_MAP[operator]) {
                    this.findOptions.where[field] = {
                        ...this.findOptions.where[field],
                        [OP_MAP[operator]]: Number(value),
                    };
                }
            }
        }

        return this;
    }


    // Búsqueda de texto parcial (iLike — PostgreSQL).
    // Modos:
    // - `searchFields: []` (array) → OR iLike en múltiples campos. Ej: USER_CONFIG
    //   ?search=juan → WHERE (name ILIKE '%juan%' OR last_name ILIKE '%juan%' OR email ILIKE '%juan%')
    // - `searchField: string` → iLike en un único campo. Ej: PRODUCT_CONFIG
    //   ?search=admin → WHERE name ILIKE '%admin%'

    search() {
        const { searchField, searchFields } = this.config;
        const term = this.queryString.search?.trim();
        if (!term) return this;

        if (searchFields?.length > 0) {
            // OR iLike sobre múltiples campos
            this.findOptions.where[Op.or] = searchFields.map((field) => ({
                [field]: { [Op.iLike]: `%${term}%` },
            }));
        } else if (searchField) {
            // iLike sobre un único campo
            this.findOptions.where[searchField] = { [Op.iLike]: `%${term}%` };
        }

        return this;
    }

    // Aplica ordenamiento según la whitelist de la config.
    // Prefijo '-' invierte la dirección: ?sort=-price → DESC
    // Soporta múltiples campos separados por coma: ?sort=-price,name

    sort() {
        if (this.queryString.sort) {
            const { sortFields } = this.config;
            const fields = this.queryString.sort.split(',');

            const order = fields
                .map(f => f.trim())
                .filter(f => sortFields.includes(f.replace(/^-/, '')))
                .map(f => f.startsWith('-')
                    ? [f.slice(1), 'DESC']
                    : [f, 'ASC']
                );

            if (order.length > 0) {
                this.findOptions.order = order;
            }
        }
        return this;
    }

    // Aplica paginación con limit y offset.
    // Soporta: ?page=2&limit=20

    paginate() {
        const { defaultLimit } = this.config;
        const page = Math.max(parseInt(this.queryString.page) || 1, 1);
        const limit = Math.min(parseInt(this.queryString.limit) || defaultLimit, MAX_LIMIT);

        this.findOptions.limit = limit;
        this.findOptions.offset = (page - 1) * limit;

        return this;
    }

    /**
     * Retorna el objeto de opciones listo para pasar a Sequelize.
     * @returns {{ where, order, limit, offset }}
     */
    build() {
        return this.findOptions;
    }
}

export default ApiQueryFeature;
