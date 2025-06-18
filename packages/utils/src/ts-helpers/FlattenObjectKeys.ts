export type FlattenObjectKeys<T extends Record<string, any>, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? FlattenObjectKeys<T[K], `${Prefix}${K extends string ? K : ''}.`>
    : `${Prefix}${K extends string ? K : ''}`;
}[keyof T]
