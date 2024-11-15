const fs = require('fs/promises');
const path = require('path');

class User {
  constructor() {
    this.filePath = path.join(__dirname, 'users.json');
    this.users = [];
    this.nextId = 1;
    this.isDirty = false;
    this.loadUsers();

    setInterval(() => {
      if (this.isDirty) {
        this.saveUsers();
        this.isDirty = false;
      }
    }, 5000);
  }

  async loadUsers() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      this.users = JSON.parse(data);
      this.nextId = this.users.length ? Math.max(...this.users.map((user) => user.id)) + 1 : 1;
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.filePath, JSON.stringify([]));
        this.users = [];
      } else {
        console.error('Error reading users file:', error);
      }
    }
  }

  async saveUsers() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.users, null, 2));
      console.log('Users saved to file');
    } catch (error) {
      console.error('Error writing to users file:', error);
    }
  }

  create(user) {
    if (this.users.some((existingUser) => existingUser.email === user.email)) {
      throw new Error('Email already exists');
    }
    const newUser = { ...user, id: this.nextId++ };
    this.users.push(newUser);
    this.isDirty = true;
    return newUser;
  }

  findById(id) {
    return this.users.find((user) => user.id === id) || null;
  }

  findByEmail(email) {
    return this.users.find((user) => user.email === email) || null;
  }

  update(id, updatedFields) {
    const user = this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updatedFields);
    this.isDirty = true;
    return user;
  }

  delete(id) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const deletedUser = this.users.splice(userIndex, 1)[0];
    this.isDirty = true;
    return deletedUser;
  }
}

module.exports = User;
