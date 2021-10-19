const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Проверка на передаваемые типы', () => {
    it('проверяется тип передаваемого поля. Ожидаем string, передается null', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 7,
        },
      });

      const errors = validator.validate({name: null});

      expect(errors).to.have.length(1);
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('expect string or number, got object');
    });

    it('проверяется тип передаваемого поля. Ожидаем string, передается объект', () => {
      const validator = new Validator({
        name: {
          type: 'string',
        },
      });

      const errors = validator.validate({name: {}});

      expect(errors).to.have.length(1);
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('expect string or number, got object');
    });

    it('проверяется тип передаваемого поля. Ожидаем string, передается число', () => {
      const validator = new Validator({
        name: {
          type: 'string',
        },
      });

      const errors = validator.validate({name: 123});

      expect(errors).to.have.length(1);
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('expect string, got number');
    });
  });

  describe('Проверка на состав передаваемых полей', () => {
    it('Проверка не зависит от очередности передаваемых полей', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 7,
        },
        age: {
          type: 'number',
          min: 14,
          max: 65,
        },
      });

      const errors = validator.validate({age: 14, name: 'asd'});

      expect(errors).to.have.length(0);
    });
    it('Будут провалидированы только поля, для которых есть правила', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 7,
        },
      });

      const errors = validator.validate({age: 14, name: 'asdd'});

      expect(errors).to.have.length(0);
    });

    it('Валидация не будет проведена, если нет соответствующих правил', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 7,
        },
      });

      const errors = validator.validate({a: 1, b: 'b'});

      expect(errors).to.have.length(0);
    });
  });

  describe('Проверка строковых значений', () => {
    it('валидатор отображает ошибку на минимальное значение', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор отображает ошибку на максимальное значение', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({name: 'lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too long, expect 5, got 6');
    });

    it('валидатор НЕ отображает ошибку если максимальное значение равно переданному', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({name: 'lalal'});

      expect(errors).to.have.length(0);
    });

    it('валидатор НЕ отображает ошибку если минимальное значение равно переданному', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({name: 'la'});

      expect(errors).to.have.length(0);
    });

    it('валидатор НЕ отображает ошибку если значение в диапазоне', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({name: 'lala'});

      expect(errors).to.have.length(0);
    });
  });

  describe('Проверка числовых значений', () => {
    it('валидатор отображает ошибку на минимальное значение', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 9});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too little, expect 10, got 9');
    });

    it('валидатор отображает ошибку на максимальное значение', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({age: 6});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too big, expect 5, got 6');
    });

    it('валидатор отображает ошибку при передаваемом NaN', () => {
      const validator = new Validator({
        name: {
          type: 'number',
        },
      });

      const errors = validator.validate({name: NaN});

      expect(errors).to.have.length(1);
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('expected number, got NaN');
    });

    it('валидатор отображает ошибку при передаваемом Infinit', () => {
      const validator = new Validator({
        name: {
          type: 'number',
        },
      });

      const errors = validator.validate({name: Infinity});

      expect(errors).to.have.length(1);
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('expected number, got Infinity');
    });

    it('валидатор НЕ отображает ошибку если максимальное значение равно переданному', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({age: 5});

      expect(errors).to.have.length(0);
    });

    it('валидатор НЕ отображает ошибку если минимальное значение равно переданному', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({age: 2});

      expect(errors).to.have.length(0);
    });

    it('валидатор НЕ отображает ошибку если значение в диапазоне', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({age: 4});

      expect(errors).to.have.length(0);
    });
  });
});
