// seeders/20240101000004-alumnos.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('alumnos', [
      { matricula: 'A2024001', nombre: 'Pedro', apellidos: 'González López', email: 'pedro@student.com', fecha_nacimiento: new Date('2015-03-15'), grupo_id: 1, created_at: new Date(), updated_at: new Date() },
      { matricula: 'A2024002', nombre: 'Ana', apellidos: 'Martínez Ruiz', email: 'ana@student.com', fecha_nacimiento: new Date('2015-05-22'), grupo_id: 1, created_at: new Date(), updated_at: new Date() },
      { matricula: 'A2024003', nombre: 'Luis', apellidos: 'Hernández Castro', email: 'luis@student.com', fecha_nacimiento: new Date('2015-08-10'), grupo_id: 1, created_at: new Date(), updated_at: new Date() },
      { matricula: 'A2024004', nombre: 'María', apellidos: 'García Díaz', email: 'maria@student.com', fecha_nacimiento: new Date('2015-02-18'), grupo_id: 2, created_at: new Date(), updated_at: new Date() },
      { matricula: 'A2024005', nombre: 'José', apellidos: 'Ramírez Torres', email: 'jose@student.com', fecha_nacimiento: new Date('2014-11-05'), grupo_id: 3, created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alumnos', null, {});
  }
};