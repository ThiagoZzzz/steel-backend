const initUser = (client, DataTypes) => {
    const User = client.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: { type: DataTypes.TEXT, allowNull: false },
        last_name: { type: DataTypes.TEXT, allowNull: false },
        email: { type: DataTypes.TEXT, unique: true, allowNull: false },
        password: { type: DataTypes.TEXT, allowNull: false },
        roles: {
            type: DataTypes.ARRAY(DataTypes.ENUM('user', 'admin')),
            defaultValue: ['user'],
            allowNull: false
        },
    }, {
        tableName: 'users',
        createdAt: 'created_at', // mapea al nombre
        updatedAt: 'updated_at'
    });

    return User;
}

export default initUser;