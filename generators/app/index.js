var Generator = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var validator = require('validator');
var mkdirp = require('mkdirp');

function pascalCasify(str) {

    str = str.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function(key) { return key.toUpperCase().replace(' ', '_')});

    return str;
}

function isNullOrEmpty(str) {
    return (!str || str == undefined || str == "" || str.length == 0);
}

module.exports = class extends Generator {

    prompting() {
        var done = this.async();

        this.log(yosay(
            'Welcome to the ' + chalk.red('Prestashop Module') + ' generator!'
        ));

        var prompts = [{
            type    : 'input',
            name    : 'prefixName',
            message : 'Prefix name (none by default, ex: ps for ps_yourmodule) (0 to 15 lowercase letters)',
            validate: function (str) {
                return validator.isLength(str, {min: 0, max: 15}) && validator.isLowercase(str);
            },
            default: ''
        },{
            type    : 'input',
            name    : 'technicalName',
            message : 'Technical Name (5 to 25 lowercase letters)',
            validate: function (str) {
                return validator.isLength(str, {min: 5, max: 25}) && validator.isLowercase(str);
            }
        },{
            type    : 'input',
            name    : 'displayName',
            message : 'Your module name (5 to 25 lowercase letters)',
            validate: function (str) {
                return validator.isLength(str, {min: 5, max: 100});
            }
        },{
            type    : 'input',
            name    : 'version',
            message : 'Module version',
            validate: function (str) {
                return /^(\d+\.)(\d+\.)(\*|\d+)$/g.test(str);
            },
            default: '1.0.0'
        },{
            type    : 'input',
            name    : 'author',
            message : 'Author (1 to 30 lowercase letters)',
            validate: function (str) {
                return validator.isLength(str, {min: 1, max: 30});
            }
        },{
            type    : 'input',
            name    : 'authorEmail',
            message : 'Author Email',
            validate: function (str) {
                return validator.isEmail(str);
            }
        },{
            type    : 'input',
            name    : 'description',
            message : 'description',
            validate: function (str) {
                return validator.isLength(str, {min: 1, max: 200});
            }
        }/*,{
            type    : 'confirm',
            name    : 'cool',
            message : 'Would you like to enable the Cool feature?'
        }*/];

        return this.prompt(prompts).then(function(answers) {
            var moduleName = pascalCasify(answers.technicalName);
            var technicalName = isNullOrEmpty(answers.prefixName) ? answers.technicalName : answers.prefixName + '_' + answers.technicalName
            var className = pascalCasify(technicalName);

            this.props = {
                prefixName    :  answers.prefixName,
                technicalName :  technicalName,
                moduleName    :  moduleName,
                displayName   :  answers.displayName,
                version       :  answers.version,
                className     :  className,
                author        :  answers.author,
                authorEmail   :  answers.authorEmail,
                description   :  answers.description.replace('\'', '\\\'')
            };

            done();
        }.bind(this));
    }

    writing() {
        var modulePath = this.destinationRoot() + '/' + this.props.technicalName;

        mkdirp(modulePath);
        mkdirp(modulePath + '/views/templates/admin');
        mkdirp(modulePath + '/views/templates/front');
        mkdirp(modulePath + '/views/hook');
        mkdirp(modulePath + '/views/css');
        mkdirp(modulePath + '/views/js');
        mkdirp(modulePath + '/views/img');
        mkdirp(modulePath + '/controllers');
        mkdirp(modulePath + '/override');
        mkdirp(modulePath + '/translations');
        mkdirp(modulePath + '/upgrade');

        this.props.moduleFileName = this.props.technicalName + '.php';

        this.fs.copyTpl(
            this.templatePath('module_name.php'), modulePath + '/' + this.props.moduleFileName,
            {
                filename        :   this.props.moduleFileName,
                technicalName   :   this.props.technicalName,
                moduleName      :   this.props.moduleName,
                displayName     :   this.props.displayName,
                version         :   this.props.version,
                className       :   this.props.className,
                author          :   this.props.author,
                authorEmail     :   this.props.authorEmail,
                description     :   this.props.description

            }
        );

        this.fs.copyTpl(
            this.templatePath('config.xml'),
            modulePath + '/config.xml', {}
        );

        this.fs.copy(
            this.templatePath('logo.png'),
            modulePath + '/logo.png'
        );
    }
};
