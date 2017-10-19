'use strict'

class Cookie {
    constructor() {
        let options;
        let defaultOptions;
        let config = {
            setDefaultOptions: {
                value(v) {
                    if (v instanceof Object) {
                        defaultOptions = Object.assign(new Object, v);
                    }
                    options = Object.assign(new Object, defaultOptions);
                }
            },
            options: {
                get() {
                    return options;
                },
                set(v) {
                    if (v instanceof Object) {
                        options = v;
                    }
                }
            }
        };
        let handler = {
            get(target, prop) {
                return target[prop];
            },
            set(target, prop, value) {
                
                if (config[prop]) {
                    target[prop] = value;
                    return;
                }
        
                target[prop] = String(value);
                let updatedCookie = prop + '=' + encodeURIComponent(value);
        
                for (var key in options) {
                    updatedCookie += `; ${key}=${options[key]}`;
                }
        
                document.cookie = updatedCookie;
            },
            deleteProperty(target, prop) {
                document.cookie = `${prop}=''; path=${options.path?options.path:'/'}; expires=${new Date().toUTCString()}`;
                return delete target[prop];
            }
        }

        let target = Object.defineProperties(new Object, config);

        document.cookie.split('; ').forEach(v => {
            v = v.split('=');
            target[v[0]] = decodeURIComponent(v[1]);
        });

        target.setDefaultOptions({
            expires: new Date(Date.now() + 30*24*60*60*1000).toUTCString(),
            path: '/'
        });
        
        return new Proxy(target, handler);
    }
}

if (typeof define === 'function' && define.amd) {
    define(function () {
        return new Cookie;
    });
} else if (typeof module === 'object' && module.exports) {
    module.exports = new Cookie;
} else {
    $.Cookie = new Cookie;
}
