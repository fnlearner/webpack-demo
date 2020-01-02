import './assets/index.css';
import './assets/index.less';
import Vue from 'vue'
import App from './App'
console.log('it is test file')
new Vue({
    render:h=>h(App)
}).$mount('#app')