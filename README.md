# Простая работа с куками на основе Proxy

```js
const cookie = require('cookie');
//чтение установленных куков
if (cookie.id === '1') {
	//удаление из куков
	delete cookie.id;
}

//установка значений
cookie.key = 'sd232f32c232d'; //document.cookie = "key=sd232f32c232d"
```

Все опции куков доступны для установки и чтения

```js
//время жизни куков
cookie.options.expires = new Date(Date.now() + 24*60*60*1000).toUTCString();
cookie.key2 = 'эта кука будет жить 24 часа';

//вернем дефолдные опции
cookie.setDefaultOptions(); 
```

Можно установить свои дефолдные значение опций куков
```js
cookie.setDefaultOptions({
	path:'/'
});
```
