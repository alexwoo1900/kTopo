function dispatch(obj: object, handlers: any, ...args: any[]) {
    for (let i = 0; i < handlers.length; ++i) {
        handlers[i].call(obj, ...args);
    }
}

export default class kEvent {
    public static Types = {
        change: "change"
    };

    [_events: string]: any;
    

    static bind = function(this: any, evName: string, evHandler: any){
        let scope = this;
        scope._events || (scope._events = {});
        let evList = scope._events[evName] || (scope._events[evName] = []);
        evList.push(evHandler);
        return scope;
    }

    static unbind = function(this: any, evName: string, evHandler: any){
        let scope = this;
        if (!scope._events) {
            return scope;
        }
        if (!evName && !evHandler) {
            scope._events = {};
            return scope;
        }
    
        let evNames = evName ? [evName] : Object.keys(scope._events);
        evNames.forEach(evName => {
            let handlers = scope._events[evName];
            if (handlers) {
                let newHandlers = [];
                if (evHandler) {
                    newHandlers = handlers.filter((handler: any) => {
                        handler = handler.handler ? handler.handler : handler;
                        return handler != evHandler;
                    });
                }
                scope._events[evName] = newHandlers;
            }
        });
        return scope;
    }

    trigger = function(this: any, evName: string, ...args: any[]){
        let scope = this;
        if (!scope._events) {
            return scope;
        }
        let evHandlers = scope._events[evName];
        if (evHandlers) {
            dispatch(scope, evHandlers, ...args);
        }
        return scope;
    }

    listen = function(this: any, obj: kEvent, evName: string, evHandler: any){
        let bound = this;
        if (obj) {
            let event = () => {
                evHandler.apply(bound, evName, evHandler);
            };

            Object.assign(event, {
                obj: obj,
                name: evName,
                handler: evHandler
            });

            obj.bind(evName, event);
        }
        return bound;
    }

    ignore = function(this: any, obj: kEvent, evName: string, evHandler: any){
        let scope = this;
        obj.unbind(evName, evHandler);
        return scope;
    }
}