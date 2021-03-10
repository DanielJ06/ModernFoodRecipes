const fs = require('fs');
const shortid = require('shortid');
const { resolve } = require('path');
const matter = require('gray-matter');
const { render, parse } = require('mustache');

const template = `---
title: '{{title}}'
desc: '{{desc}}'
category: '{{category}}'
uuid: {{uuid}}
---

{{{content}}}
`

module.exports = {
  Generate(data) {
    try {
      const {title, desc, category, content} = data
      const hash = shortid.generate()
      const path = resolve(__dirname, '..', 'content', `${hash}.md`)
      const contentPage = render(template, {
        title,
        desc,
        category,
        content,
        uuid: hash
      });
      fs.writeFileSync(path, contentPage, 'utf8');
    } catch(err) {
      console.log(err);
    }
  },

  Edit(data) {
    const {title, desc, content, category, uuid} = data;
    const path = resolve(__dirname, '..', 'content', `${uuid}.md`);
    const contentPage = render(template, {
      title,
      desc,
      category,
      content,
      uuid: uuid
    });
    fs.writeFileSync(path, contentPage, 'utf8');
  },

  Delete(fileName) {
    const path = resolve(__dirname, '..', 'content', `${fileName}.md`)
    if (path) {
      fs.unlinkSync(path);
    } else {
      return "File doesn't exists"
    }
  },

  Read(fileName) {
    const path = resolve(__dirname, '..', 'content', `${fileName}.md`)
    const rawContent = fs.readFileSync(path, {
      encoding: "utf-8",
    });
    return rawContent;
  },

  List(filterOpt) {
    const path = resolve(__dirname, '..', 'content')
    const files = fs.readdirSync(path, "utf-8");
    const allFiles = files.filter((fn) => fn.endsWith(".md"));

    if (filterOpt) {
      const dt = allFiles.filter(file => {
        const filepath = resolve(__dirname, '..', 'content', file);
        const rawContent = fs.readFileSync(filepath, {encoding: "utf-8"});
        const parsed = matter(rawContent);
  
        if (filterOpt === parsed.data.category) {
          return parsed.data;
        }
  
      }).map(file => {
        const filepath = resolve(__dirname, '..', 'content', file);
        const rawContent = fs.readFileSync(filepath, {encoding: "utf-8"});
        const parsed = matter(rawContent);
  
        return parsed.data
      })
      return dt;
    } else {
      const data = allFiles.map(file => {
        const filepath = resolve(__dirname, '..', 'content', file);
        const rawContent = fs.readFileSync(filepath, {encoding: "utf-8"});
        const parsed = matter(rawContent);

        return parsed.data;
      })
      return data;
    }
  }
}