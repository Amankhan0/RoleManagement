export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};


export const ObjIsEmpty = (obj: object): boolean => Object.keys(obj).length === 0;
