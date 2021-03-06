/* eslint-disable */
const capitalize = require("../libs/capitalize");
const pluralize = require("pluralize");
const Types = require("../types");

const Form = class {
  constructor(name, model, resource) {
    this.modelName = name;
    this.model = model;
    this.resource = resource;
  }

  getTemplate() {
    let capitalizedName = capitalize(this.modelName);

    let template = `<template>
      <div id="${this.modelName}Form" class="form">
       <form @submit.prevent="handleSubmit">
        templateStructString
       </form>
      </div>
    </template>
    `;

    let templateStruct = "";

    let countFiles = 0;
    //Template Struct
    for (let property in this.model) {


      if (this.model.hasOwnProperty(property)) {

        if (this.model[property].type == Types.HIDDEN_FIELDS) continue;

        templateStruct += `\t<div class="form-group">\n\t\t<label for="${property}">${property}</label>\n`;

        if (this.model[property].type == Types.SELECT) {
          templateStruct += `
          <multiselect
            v-model="${this.modelName}.${property}"
            :options="${this.modelName}.relations.${property}"
            :searchable="true"
            :close-on-select="true"
            :show-labels="false"
            placeholder="Pick a value"
            />\n`;
        } else if (this.model[property].type == Types.TEXTAREA) {
          templateStruct += `\t<textarea id="${property}" style="width: 100%" v-model="${this.modelName}.${property}" rows="10">You text here...</textarea>\n\n`;
        } else if (this.model[property].type == "radio") {
          templateStruct += "<br />";
          for (let option of this.model[property].options) {
            templateStruct += `\t<input type="radio" id="${option.id}" value="${option.value}" v-model="${this.modelName}.${property}">\n`;
            templateStruct += `\t<label for="${option.id}">${option.value}</label><br>\n\n`;
          }
        } else if (this.model[property].type == Types.CHECKBOX) {
          for (let option of this.model[property].options) {
            templateStruct += `\t<input type="checkbox" id="${option.id}" value="${option.value}" v-model="${this.modelName}.${property}">\n`;
            templateStruct += `\t<label for="${option.id}">${option.value}</label><br>\n\n`;
          }
        } else if (this.model[property].type == Types.FILE) {
          templateStruct += `\t<input type="file" id="${property}"  v-on:change="${property}OnFileChange">\n`;
          countFiles++;
        } else if (
          this.model[property].type == Types.ONE_TO_ONE ||
          this.model[property].type == Types.ONE_TO_MANY
        ) {
          templateStruct += `\t`;
          if (this.model[property].type == Types.ONE_TO_ONE) {
            templateStruct += `
                <multiselect
                  v-model="${this.modelName}.${property}"
                  :options="${this.modelName}.relations.${property}"
                  :searchable="true"
                  :close-on-select="true"
                  :show-labels="false"
                  placeholder="Pick a value"
                  label="${this.model[property].attribute}"
                  track-by="${this.model[property].attribute}">
                </multiselect>\n`;
          } else {
            templateStruct += `
                <multiselect
                  v-model="${this.modelName}.${property}"
                  :options="${this.modelName}.relations.${property}"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Pick some"
                  label="${this.model[property].attribute}"
                  track-by="${this.model[property].attribute}"
                  >
                </multiselect>\n`;
          }
        } else if (this.model[property].type == Types.HTML) {
          templateStruct += `\t
              <quill-editor
                v-model="${this.modelName}.${property}"
                ref="myQuillEditor"
                :options="{}"
              />
              \n`;
        } else if (this.model[property].type == Types.CURRENCY) {
          templateStruct += `\t
              <money
                id="value"
                class="form-control"
                v-model.lazy="${this.modelName}.${property}"
              />\n`;
        } else {
          templateStruct += `\t<input id="${property}" class="form-control" `;
          for (let htmlProp in this.model[property]) {
            if (this.model[property].hasOwnProperty(htmlProp)) {
              templateStruct += ` ${htmlProp}="${this.model[property][htmlProp]}" `;
            }
          }
          templateStruct += ` v-model="${this.modelName}.${property}">\n\n`;
        }
      }
      templateStruct += `</div>\n`;
    }

    let script = `
<script>
  import { get${capitalizedName} } from "@/services/${this.modelName}";
  relationsImport
  import { mapActions } from "vuex";

  dataImport

  export default {
    props: ["id"],
    data () {
      return {
        ${this.modelName}: {
          relations: {
            relationsScript
          },
          dataScript
        }
      }
    },
    created() {
      this.setInstace();
    },
    methods: {
      ...mapActions("${this.modelName}", ["create${capitalizedName}", "update${capitalizedName}"]),
      methodsScript
      async handleSubmit() {
        if (this.id) {
          //Implements here your submit method UPDATE
          /**
          * type equals 0 means that this modal disappear automatically after 1500 milliseconds
          * type equals 1 means that this modal  will have button close without timer
          * type equals 2 means that this modal will have button close and ok without timer
          */
          let option = await this.$modal.show({title: "Warning", message: "Do you have sure that want complete this updated?", alert: "warning", type: 2});
          if (option) {
            let ${this.modelName} = this.${this.modelName};
            delete ${this.modelName}.relations;

            this.update${capitalizedName}(${this.modelName})
            .then( (response) => {
              if ( response ) {
                  this.$modal.show({title: "Success", message: "${this.modelName} was updated with successfull!", alert: "success"});
                  this.goBack();
              }
            }).catch(error => {
              this.$modal.show({title: "Error", message: "Server response with error" + error, alert: "danger", type: 1});
            });
          }
        } else {
          //Implements here your submit method CREATE
          let option = await this.$modal.show({title: "Warning", message: "Do you want to continue?", alert: "warning", type: 2});
          if (option){
            let ${this.modelName} = this.${this.modelName};
            delete ${this.modelName}.relations;

            this.create${capitalizedName}(${this.modelName})
            .then( response => {
                if (response) {
                  this.$modal.show({title: "Success", message: "${this.modelName} was created with successfull!", alert: "success"});
                  this.goBack();
                }
            }).catch(error => {
              this.$modal.show({title: "Error", message: "Server response with error" + error, alert: "danger", type: 1});
            })
          }
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      setInstace() {
        if (this.id) {
          this.${this.modelName}.id = this.id;
          get${capitalizedName}(this.id)
            .then(response => {
              let instance = response.data;
              for (let property in instance) {
                if (instance.hasOwnProperty(property) && this.${this.modelName}.hasOwnProperty(property)) {
                  this.${this.modelName}[property] = instance[property];
                }
              }
            })
        }
        this.setDependencies();
      },
      setDependencies() {
        relationsFetchScript
      }
    },
    components: {
      dataComponent
    }
  }
</script>
<style lang="css" scoped>
  label {
    text-transform: capitalize;
  }
  button {
    margin: 8px;
    width: 30%;
    float: right;
  }
  form {
    overflow: hidden;
  }
</style>

`;

    let dataImport = ``;
    let dataComponent = ``;

    for (let property in this.model) {
      if (this.model.hasOwnProperty(property)) {

        if (this.model[property].type == Types.HIDDEN_FIELDS) continue;

        if (this.model[property].type == Types.HTML) {
          if (dataImport == "") {
            dataImport += `
            import "quill/dist/quill.core.css";
            import "quill/dist/quill.snow.css";
            import "quill/dist/quill.bubble.css";

            import { quillEditor } from "vue-quill-editor";`;
            dataComponent += "quillEditor";
          }
        }
      }
    }

    let dataScript = ``;
    let relationsScript = ``;

    for (let property in this.model) {
      if (this.model.hasOwnProperty(property)) {

        if (this.model[property].type == Types.HIDDEN_FIELDS) continue;

        if (this.model[property].type == Types.SELECT) {
          relationsScript += `${property}: ${JSON.stringify(
            this.model[property].options
          )},\n`;
          dataScript += `${property}: '',\n`;
        } else if (this.model[property].type == Types.CHECKBOX) {
          dataScript += `${property}: [],\n`;
        } else if (this.model[property].type == Types.ONE_TO_ONE) {
          relationsScript += `${property}: [],\n`;
          dataScript += `${property}: {},\n`;
        } else if (this.model[property].type == Types.ONE_TO_MANY) {
          relationsScript += `${property}: [],\n`;
          dataScript += `${property}: [],\n`;
        } else if (
          this.model[property].type == Types.RADIO ||
          this.model[property].type == Types.TEXTAREA ||
          this.model[property].type == Types.FILE
        ) {
          dataScript += `${property}: '',\n`;
        } else {
          dataScript += `${property}: '',\n`;
        }
      }
    }

    let relationsFetchScript = ``;
    let relationsImport = ``;

    for (let property in this.model) {
      if (this.model.hasOwnProperty(property)) {

        if (this.model[property].type == Types.HIDDEN_FIELDS) continue;

        if (
          this.model[property].type == Types.ONE_TO_ONE ||
          this.model[property].type == Types.ONE_TO_MANY
        ) {
          let capitalizedRelationName = capitalize(this.model[property].model);
          let pluralizedAndCapitalizedRelationName = pluralize(
            capitalizedRelationName
          );
          relationsImport += `
              import { getAll${pluralizedAndCapitalizedRelationName} } from "@/services/${this.model[property].model}";
            `;
          relationsFetchScript += `
            getAll${pluralizedAndCapitalizedRelationName}()
              .then(response => {
                this.${this.modelName}.relations.${property} = response.data;
              });
            `;
        }
      }
    }

    let methodsScript = ``;

    if (countFiles > 0) {
      for (let property in this.model) {
        if (this.model.hasOwnProperty(property)) {
          if (this.model[property].type == Types.FILE) {
            methodsScript += `
              ${property}OnFileChange(e){
                let files = e.target.files || e.dataTransfer.files;
                if(files.length){
                  this.${this.modelName}.${property} = files[0];
                }
              },
              `;
          }
        }
      }
    }

    //Template Struct Buttons
    templateStruct += `
    <button v-if="id" type="submit"  name="buttonUpdate" class="btn btn-primary " >Update</button>
    <button v-else type="submit"  name="buttonCreate" class="btn btn-success " >Save</button>
    <button  type="button" @click="goBack" name="button" class="btn btn-default" >Back</button>
    `;

    template = template.replace(`templateStructString`, templateStruct);
    script = script.replace(`relationsScript`, relationsScript);
    script = script.replace(`dataScript`, dataScript);
    script = script.replace(`methodsScript`, methodsScript);
    script = script.replace(`dataImport`, dataImport);
    script = script.replace(`dataComponent`, dataComponent);
    script = script.replace(`relationsImport`, relationsImport);
    script = script.replace(`relationsFetchScript`, relationsFetchScript);

    return template + script;
  }
};

module.exports = Form;
