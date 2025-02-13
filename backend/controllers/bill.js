const { Bill } = require('../models');

const getFileURL = (filePath) => `http://localhost:5678/${filePath}`;

const isPicture = (mimeType) => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(mimeType);

const create = async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(401).send({ message: 'user must be authenticated' });
  }
  try {
    const bill = await Bill.create({
      name: req.body.name,
      type: req.body.type,
      email: req.body.email,
      date: req.body.date,
      vat: req.body.vat,
      pct: req.body.pct,
      commentary: req.body.commentary,
      status: req.body.status,
      commentAdmin: req.body.commentAdmin,
      amount: req.body.amount,
      fileName: req.file && isPicture(req.file.mimetype) ? req.file.originalname : false,
      filePath: req.file && isPicture(req.file.mimetype) ? req.file.path : false,

    });
    return res.status(201).json(bill);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const get = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send({ message: 'user must be authenticated' });
  try {
    const bill = user.type === 'Admin'
      ? await Bill.findOne({ where: { key: req.params.id } })
      : await Bill.findOne({
        where: { key: req.params.id, email: user.email },
      });
    if (!bill) return res.status(401).send({ message: 'unauthorized action' });
    const {
      key: id,
      name,
      type,
      email,
      date,
      vat,
      pct,
      commentary,
      status,
      commentAdmin,
      fileName,
      amount,
      filePath,
    } = bill;
    return res.json({
      id,
      name,
      type,
      email,
      date,
      vat,
      pct,
      commentary,
      status,
      commentAdmin,
      fileName,
      fileUrl: getFileURL(filePath),
      amount,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const list = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send({ message: 'user must be authenticated' });
  try {
    const bills = user.type === 'Admin'
      ? await Bill.findAll()
      : await Bill.findAll({ where: { email: user.email } });
    return res.json(
      bills.map(
        ({
          key: id,
          name,
          type,
          email,
          date,
          vat,
          pct,
          commentary,
          status,
          commentAdmin,
          fileName,
          amount,
          filePath,
        }) => ({
          id,
          name,
          type,
          email,
          date,
          vat,
          pct,
          commentary,
          status,
          commentAdmin,
          fileName,
          amount,
          fileUrl: getFileURL(filePath),
        }),
      ),
    );
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const update = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send({ message: 'user must be authenticated' });
  try {
    const {
      name,
      type,
      email,
      date,
      vat,
      pct,
      commentary,
      status,
      commentAdmin,
      amount,
    } = req.body;
    const toUpdate = {
      name,
      type,
      email,
      date,
      vat,
      pct,
      commentary,
      status,
      commentAdmin,
      amount,
    };
    const bill = user.type === 'Admin'
      ? await Bill.findOne({ where: { key: req.params.id } })
      : await Bill.findOne({
        where: { key: req.params.id, email: user.email },
      });
    if (!bill) return res.status(401).send({ message: 'unauthorized action' });
    const updated = await bill.update(toUpdate);
    return res.json(updated);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
const remove = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send({ message: 'user must be authenticated' });
  try {
    const bill = user.type === 'Admin'
      ? await Bill.findOne({ where: { key: req.params.id } })
      : await Bill.findOne({
        where: { key: req.params.id, email: user.email },
      });
    if (!bill) return res.status(401).send({ message: 'unauthorized action' });
    await Bill.destroy({ where: { id: bill.id } });
    return res.send('Bill removed');
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
