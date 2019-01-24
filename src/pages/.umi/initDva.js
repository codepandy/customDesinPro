import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/models/login.js').default) });
app.model({ namespace: 'project', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/models/user.js').default) });
app.model({ namespace: 'register', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/pages/User/models/register.js').default) });
app.model({ namespace: 'analyze', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/pages/AnalyzeData/models/analyze.js').default) });
app.model({ namespace: 'transportation', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/pages/Transportation/models/transportation.js').default) });
app.model({ namespace: 'error', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/pages/Exception/models/error.js').default) });
app.model({ namespace: 'geographic', ...(require('/Users/iss/项目/闪送配送系统/ss-ds/src/pages/Account/Settings/models/geographic.js').default) });
