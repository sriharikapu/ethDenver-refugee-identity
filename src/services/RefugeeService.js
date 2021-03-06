import { web3 } from "../util/Uport";
import contract from 'truffle-contract';
import Refugee from '../ethereum/build/contracts/RefugeeIdentity.json';

const RefugeeContract = contract(Refugee);

RefugeeContract.setProvider(web3.currentProvider);

class Refugees {
  async getInstance() {
    const instance = await RefugeeContract.deployed();
    return instance;
  }

  async addPerson(userAddress, _fullName, _origin, _organization, _ipfs1, _ipfs2) {
    const instance = await this.getInstance();
    const items = await instance.addPerson(_fullName, _origin, _organization, _ipfs1, _ipfs2, { from: userAddress });
    return items;
  }

  async editPerson(userAddress, _id, _fullName, _origin, _organization, _ipfs1, _ipfs2) {
    const instance = await this.getInstance();
    const items = await instance.editPerson(_id, _fullName, _origin, _organization, _ipfs1, _ipfs2, { from: userAddress });
    return items;
  }

  async getOnePersonById(_id) {
    const instance = await this.getInstance();
    const item = await instance.getOnePersonById(_id);
    return userObject(item);
  }

  async transferIdentityOwnership(adminAddress, _refugeeAddress, _id) {
    const instance = await this.getInstance();
    const item = await instance.transferIdentityOwnership(_refugeeAddress, _id, { from: adminAddress });
    return item;
  }

  async getAll() {
    const instance = await this.getInstance();
    const data = await instance.getAll();
    return createUsersObject(data);
  }

}

export default new Refugees();

function createUsersObject(data) {
  let serializeData = [];
  for (let i = 0; i < data[1].length; i++) {
    serializeData.push({
      id: data[0][i]['c'][0],
      name: web3.toAscii(data[1][i]),
      origin: web3.toAscii(data[2][i]),
      oraganization: web3.toAscii(data[3][i]),
      ipfs: `${web3.toAscii(data[4][i])}${web3.toAscii(data[5][i])}`
    })
  }
  return serializeData;
}

function userObject(data) {
  return {
    id: data[0].c[0],
    name: web3.toAscii(data[1]),
    origin: web3.toAscii(data[2]),
    oraganization: web3.toAscii(data[3]),
    ipfs: `${web3.toAscii(data[4])}${web3.toAscii(data[5])}`
  }
}
