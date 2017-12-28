import { Meteor } from 'meteor/meteor';

Meteor.methods({
  searchName(_inputName) {

    // Se assegurar de que usaremos o primeiro nome
    var inputName = _inputName.split(' ')[0];

    var retName;
    var retNumber = 0;

    // Guarda numa variável o retorno da API com o nome solicitado.
    // Retorna sempre um Array, mesmo que seja requisitado apenas um nome
    const IbgeNomes = HTTP.call('GET', `http://servicodados.ibge.gov.br/api/v2/censos/nomes/${inputName}`);

    // Varre o array de nomes. Poderia pegar somente o primeiro elemento, mas serve para implementações futuras.
    _.each(IbgeNomes.data, (result)=> {


      _.each(result.res, (periods)=> {
        retNumber += periods.frequencia;
      });

      retName = {
        name: result.nome,
        number: retNumber

      };
    });

    Meteor.call('insertSearchLog', retName.name, retNumber);

    return retName;

  },

  insertSearchLog(name, number) {
    SearchLog.insert({
      name: name,
      number: number,
      timestamp: new Date()
    });
  },

  getSearchsTotal() {
    return SearchLog.find().count();
  }
});

Meteor.publish('searchLogPublication', ()=> {
  return SearchLog.find();
});
