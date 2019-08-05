const isPlainObject: (obj: any) => boolean = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) { return false; }

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
};

export const reduxClassActionMiddleware =
  (store: object) =>
    (next: (action: any) => void) =>
      (action: any) => {
        const _action = isPlainObject(action) ? action : {...action};
        return next(_action);
      };

export default reduxClassActionMiddleware;