兼容ie
npm install babel-polyfill 注意：不要加--save dev
在 main.js文件第一行引入babel-polyfill
	import 'babel-polyfill'
（3） 在vue.config.js中配置configureWebpack信息,添加如下代码：

configureWebpack: {
    module: {
      rules: [
        {
          test: /\.m?js$/,
          include: [
            resolve('src'),
            resolve('test'),
            resolve('node_modules/webpack-dev-server/client'),
            resolve('node_modules/iview/src'),
            resolve('node_modules/tree-table-vue/lib'),
            resolve('node_modules/v-org-tree/dist'),
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  }	
————————————————
版权声明：本文为CSDN博主「徐RR」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/weixin_44151993/article/details/101429473