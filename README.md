List of 3rd-party projects used in this boilerplate:
* React, maintained by Facebook
* next.js, maintained by Zeit
* TypeScript, maintained by Microsoft
* Ant Design, maintained by Alibaba
* styled-jsx, maintained by Zeit
* next-mdx-enhanced, maintained by HashiCorp
* i18next, sponsored by BrowserStack
* less.js

Assumptions and goals:
* Site must be multi-lingual
* URLs are publicly known, it's a contract we have with third parties, and need it to be long lived
* Having localized URLs will boost SEO, so the URL is locale-dependent. Generated links must be localized too
* Code splitting must be used to reduce size of bundle sent to the browser
* All pages and components must be typed using TypeScript
* Simple text pages can be written in MDX, extending Markdown with React
* Less is enough for our styling needs, we want to avoid the learning curve of Sass
