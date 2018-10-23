let CustomMaterial = require("CustomMaterial");

cc.Class({
    extends: cc.Component,

    properties: {
        _shaderObject: null,
        shaderFile: {
            default: '',
            notify() {
                if (!this.shaderFile) {
                    return;
                }
                this.applyShader();
            }
        },
    },

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);
        this.applyShader();
    },

    update() {
        if (this._shaderObject.update) {
            this._shaderObject.update(this.sprite, this.material);
        }
    },

    /**
     * 启用Shader
     */
    applyShader() {
        if (CC_EDITOR) {
            return;
        }

        this._shaderObject = require(this.shaderFile);
        if (!this._shaderObject) {
            return;
        }
        
        CustomMaterial.addShader(this._shaderObject);
        let sprite = this.sprite;
        let params = this._shaderObject.params;
        let defines = this._shaderObject.defines;
        let material = sprite.getMaterial(this._shaderObject.name);
        
        if (!material) {
            material = new CustomMaterial(this._shaderObject.name, params, defines || []);
            sprite.setMaterial(this._shaderObject.name, material);
        }
        this.material = material;

        sprite.activateMaterial(this._shaderObject.name);

        //设置Shader参数初值
        if (params) {
            params.forEach((item) => {
                if (item.defaultValue !== undefined) {
                    material.setParamValue(item.name, item.defaultValue);
                }
            });
        }

        if (this._shaderObject.start) {
            this._shaderObject.start(sprite, material);
        }
    },
});
