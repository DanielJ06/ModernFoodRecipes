const { Router } = require('express');
const FM = require('./utils/generateFile');

const { secret } = require('./utils/passwordHash');

const routes = new Router();

routes.post('/authenticate', (req, res) => {
  const { key } = req.body;
  
  if (key === secret) {
    return res.json({ key: secret });
  } else {
    return res.status(401).json({ error: 'Incorrect password' });
  }
})

routes.post('/create', (req, res) => {
  const { key } = req.headers;

  if (key === secret) {
    const {content, title, desc, category} = req.body;
    FM.Generate({
      content,
      title,
      desc,
      category
    });
    return res.json({ message: 'success' });
  } else {
    return res.json({ error: 'key does not match' });
  }
});

routes.put('/edit/:fileName', (req, res) => {
  const { key } = req.headers;

  if(key === secret) {
    const { fileName } = req.params;
    const { title, desc, content, category } = req.body;
    FM.Edit({
      title,
      desc,
      content,
      category,
      uuid: fileName
    });
    return res.json({ message: 'Success' });
  } else {
    return res.json({ error: 'key does not match' });
  }
});

routes.delete('/delete/:fileName', (req, res) => {
  const { key } = req.headers;

  if (key === secret) {
    const { fileName } = req.params;
    FM.Delete(fileName);
    return res.json({ message: 'Success' })
  } else {
    return res.json({ error: `Something went wrong!` })
  }
})

routes.get('/read/:fileName', (req, res) => {
  try {
    const { fileName } = req.params
    const data = FM.Read(fileName)
    return res.json(data);
  } catch(err) {
    return res.json({ error: "File doesn't exists" })
  }
})

routes.get('/list', (req, res) => {
  const { filter } = req.query;

  if (filter) {
    const data = FM.List(filter);
    return res.json(data);  
  }

  const data = FM.List();
  return res.json(data);
})

module.exports = routes