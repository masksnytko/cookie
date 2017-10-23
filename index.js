'use strict'

class Cookie {
    /**
    * @param {Object} [defaultOptions] - опциональный параметр дефолтных значений куков
    */
    constructor(defaultOptions) {
        
        let _options;

        Object.defineProperty(this, 'options', {
            get() {
                return _options;
            },
            set(v) {
                if (v instanceof Object) {
                    _options = v;
                }
            }
        });

        if (defaultOptions instanceof Object) {
            _options = defaultOptions;
        } else {
            _options = {
                expires: new Date(Date.now() + 30*24*60*60*1000).toUTCString()
            };
        }
        
        let handler = {
            get(target, prop) {
                return target[prop];
            },
            set(target, prop, value) {
                
                if (prop === 'options') {
                    target.options = value;
                    return;
                }

                target[prop] = String(value);
                let updatedCookie = prop + '=' + encodeURIComponent(value);
        
                for (var key in _options) {
                    updatedCookie += `; ${key}=${_options[key]}`;
                }
        
                document.cookie = updatedCookie;
            },
            deleteProperty(target, prop) {
                document.cookie = `${prop}=''; path=${_options.path?_options.path:'/'}; expires=${new Date().toUTCString()}`;
                return delete target[prop];
            }
        };

        document.cookie.split('; ').forEach(v => {
            v = v.split('=');
            this[v[0]] = decodeURIComponent(v[1]);
        });
        
        return new Proxy(this, handler);
    }
}

let cookie = new Cookie();

if (typeof define === 'function' && define.amd) {
    define(function () {
        return cookie;
    });
} else if (typeof module === 'object' && module.exports) {
    module.exports = cookie;
} else {
    $.Cookie = new Cookie;
}
