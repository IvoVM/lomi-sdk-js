module.exports = (admin) => {
    const userRolsDoc = admin.firestore().doc('backoffice-app/userRol');
    const userPrivilegesDoc = admin.firestore().doc('backoffice-app/userPrivileges');

    const getUserRolById = async (id) => {
        const userRolsData = await userRolsDoc.get();
        const userRolsValues = Object.values(userRolsData.data());
        const userRolDefinition = userRolsValues.find((rol) => rol.id == id);
        return userRolDefinition;
    };

    const getUserRolPrivileges = async (id) => {
        const userRolDefinition = await getUserRolById(id);
        console.log(userRolDefinition, 'userRolDefinition');
        const userPrivilegesIds = userRolDefinition.userPrivileges;
        const userPrivileges = await userPrivilegesDoc.get();
        const userPrivelegesData = userPrivileges.data();
        console.log(userPrivelegesData, 'userPrivelegesData');
        console.log(userPrivilegesIds, 'userPrivilegesIds');
        const userPrivelegesFiltered = Object.values(userPrivelegesData).filter((privelege) => userPrivilegesIds.includes(privelege.id));
        return userPrivelegesFiltered;
    }

    return {
        getUserRolById,
        getUserRolPrivileges
    }
}