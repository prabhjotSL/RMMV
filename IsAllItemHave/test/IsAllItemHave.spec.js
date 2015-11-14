should = require('chai').should();
sinon = require('sinon');

describe('IsAllItemHave', function() {
    // initialize
    before(function() {
        // define mock PluginManager
        PluginManager = {};
        PluginManager.parameters = sinon.stub()
        .withArgs('IsAllItemHave').returns({
            // PluginParam: 'default'
        });
        // define mock Game_Interpreter
        Game_Interpreter = function() {};
        Game_Interpreter.prototype.pluginCommand = sinon.stub();

        // define mock Game_Party
        Game_Party = function() {};
        Game_Party.prototype.allItems = function() {};
        Game_Party.prototype.members = function() {};

        // import Test functions.
        IsAllItemHave = require('../IsAllItemHave.js');
        isAllItemHave = IsAllItemHave.isAllItemHave;
        Game_Party.prototype.isAllItemHave = isAllItemHave;
        pluginCommand = IsAllItemHave.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = pluginCommand;
        isValidName = IsAllItemHave.isValidName;
        isValidTargets = IsAllItemHave.isValidTargets;
    });

    describe('validator', function() {

        it('#isValidName invalid name', function() {
            isValidName('validName').should.be.true;
        });

        it('#isValidName valid name', function() {
            isValidName(undefined).should.be.false;
        });

        it('#isValidTargets valid targets', function() {
            isValidTargets(['validName']).should.be.true;
        });

        it('#isValidTargets invalid targets', function() {
            isValidTargets(undefined).should.be.false;
            isValidTargets([]).should.be.false;
        });

    });

    beforeEach(function() {
        var items = [{name: 'dummy1'}, {name: 'dummy2'}];
        var equips1 = [{name: 'dummy1'}, {name: 'dummy2'}];
        var actor1 = {};
        actor1.equips = sinon.stub().returns(equips1);
        var equips2 = [{name: 'dummy1'}, {name: 'dummy2'}];
        var actor2 = {};
        actor2.equips = sinon.stub().returns(equips2);

        gameParty = new Game_Party();
        allItems = sinon.stub(gameParty, 'allItems').returns(items);
        members = sinon.stub(gameParty, 'members').returns([actor1, actor2]);
    });

    describe('Party has a target item', function() {
        beforeEach(function() {
            var items = [{name: 'targetName'}, {name: 'dummy2'}];
            allItems.returns(items);
        });

        afterEach(function() {
            var items = [{name: 'dummy1'}, {name: 'dummy2'}];
            allItems.returns(items);
        });

        it('target find', function() {
            gameParty.isAllItemHave(['targetName']).should.be.true;
        });

        it('two target find', function() {
            gameParty.isAllItemHave(['targetName', 'otherTarget']).should.be.false;
        });

        it('target not found', function() {
            gameParty.isAllItemHave(['notMatchName']).should.be.false;
        });
    });

    describe('Party has two target item', function() {
        beforeEach(function() {
            var items = [{name: 'targetName1'}, {name: 'targetName2'}];
            allItems.returns(items);
        });

        afterEach(function() {
            var items = [{name: 'dummy1'}, {name: 'dummy2'}];
            allItems.returns(items);
        });

        it('one target find', function() {
            gameParty.isAllItemHave(['targetName1', 'notMatchName2']).should.be.false;
        });

        it('two targets not found', function() {
            gameParty.isAllItemHave(['targetName1', 'targetName2']).should.be.true;
        });

        it('target not found', function() {
            gameParty.isAllItemHave(['notMatchName1', 'notMatchName2']).should.be.false;
        });
    });

    describe('Party has one target equips', function() {
        beforeEach(function() {
            var equips1 = [{name: 'targetName'}, {name: 'dummy2'}];
            var actor1 = {};
            actor1.equips = sinon.stub().returns(equips1);
            var equips2 = [{name: 'dummy1'}, {name: 'dummy2'}];
            var actor2 = {};
            actor2.equips = sinon.stub().returns(equips2);
            members.returns([actor1, actor2]);
        });

        afterEach(function() {
            var equips1 = [{name: 'dummy1'}, {name: 'dummy2'}];
            var actor1 = {};
            actor1.equips = sinon.stub().returns(equips1);
            var equips2 = [{name: 'dummy1'}, {name: 'dummy2'}];
            var actor2 = {};
            actor2.equips = sinon.stub().returns(equips2);
            members.returns([actor1, actor2]);
        });

        it('target find', function() {
            gameParty.isAllItemHave(['targetName']).should.be.true;
        });

        it('two targets not found', function() {
            gameParty.isAllItemHave(['targetName', 'otherTarget']).should.be.false;
        });

        it('target not found', function() {
            gameParty.isAllItemHave(['notMatchName']).should.be.false;
        });
    });

    describe('Party has two target equips', function() {
        beforeEach(function() {
            var equips1 = [{name: 'targetName1'}, {name: 'targetName2'}];
            var actor1 = {};
            actor1.equips = sinon.stub().returns(equips1);
            var equips2 = [{name: 'dummy1'}, {name: 'dummy2'}];
            var actor2 = {};
            actor2.equips = sinon.stub().returns(equips2);
            members.returns([actor1, actor2]);
        });

        afterEach(function() {
            var equips1 = [{name: 'dummy1'}, {name: 'dummy2'}];
            var actor1 = {};
            actor1.equips = sinon.stub().returns(equips1);
            var equips2 = [{name: 'dummy1'}, {name: 'dummy2'}];
            var actor2 = {};
            actor2.equips = sinon.stub().returns(equips2);
            members.returns([actor1, actor2]);
        });

        it('one target find', function() {
            gameParty.isAllItemHave(['targetName1', 'notMatchName2']).should.be.false;
        });

        it('two target find', function() {
            gameParty.isAllItemHave(['targetName1', 'targetName2']).should.be.true;
        });

        it('target not found', function() {
            gameParty.isAllItemHave(['notMatchName1', 'notMatchName2']).should.be.false;
        });
    });

    it('Party not have target item and equips', function() {
        gameParty.isAllItemHave(['targetName']).should.be.false;
    });

    describe('call from PluginCommand', function() {
        beforeEach(function() {
            gameInterpreter = new Game_Interpreter();
        });

        describe('command name match', function() {
            beforeEach(function() {
                var items = [{name: 'dummy1'}, {name: 'dummy2'}];
                var equips1 = [{name: 'dummy1'}, {name: 'dummy2'}];
                var actor1 = {};
                actor1.equips = sinon.stub().returns(equips1);
                var equips2 = [{name: 'dummy1'}, {name: 'dummy2'}];
                var actor2 = {};
                actor2.equips = sinon.stub().returns(equips2);

                $gameParty = new Game_Party();
                sinon.stub($gameParty, 'allItems').returns(items);
                sinon.stub($gameParty, 'members').returns([actor1, actor2]);

                spy = sinon.spy($gameParty, 'isAllItemHave');
            });

            it('valid argments', function() {
                gameInterpreter.pluginCommand('isAllItemHave', ['1', 'foo', 'bar']);
                spy.called.should.be.true;
            });

            it('invalid argments', function() {
                gameInterpreter.pluginCommand('isAllItemHave', ['aaa', 'foo', 'bar']);
                spy.called.should.be.false;
            });

        });

        it('command name not match', function() {
            gameInterpreter.pluginCommand('otherCommand', ['1', 'foo', 'bar']);
        });
    });

});
