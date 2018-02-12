<template>
  <Form :model="formItem" :rules="ruleValidate" :label-width="100" ref="formItem">
    <FormItem label="项目省份" prop="ProvinceCode">
      <template>
        <Select v-model="formItem.ProvinceCode" @on-change="text">
          <Option v-for="item in select" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
    </FormItem>
    <FormItem label="排序序号" prop="Sort">
      <Input v-model="formItem.Sort"></Input>
    </FormItem>
    <a @click="closeModal" class="btn-close-modal"><Icon type="close-round"></Icon></a>
  </Form>
</template>
<script>
export default {
  data: function () {
    return {
      formItem: {
        ID: 0,
        ProvinceName: '',
        ProvinceCode: '',
        Sort: ''
      },
      select: [],
      ruleValidate: {
        ProvinceName: [
          {required: true,  message: "省份不能为空", trigger: "change", type: 'number'}
        ],
        Sort: [
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ],
        ProvinceCode: [
          { required: true, validator: this.G.validateNumber, trigger: "blur" }
        ]
      }
    }
  },
  props: {
    echoData: {}
  },
  methods: {
    closeModal: function () {
      this.$Modal.remove()
    },
    text: function () {
      this.select.forEach(data => {
        if (data.value === this.formItem.ProvinceCode) {
          this.formItem.ProvinceName = data.label
        }
      })
    },
    formRef: function() {
      this.$emit("formRef", this.$refs["formItem"])
    },
    formSubmit: function () {
      this.$emit('formData', this.formItem)
    }
  },
  mounted: function () {
    this.axios.get(this.api.provinceSelect, {
    }).then(res => {
      if (res.data.Success === true) {
        res.data.Data.forEach(data => {
          this.select.push({'label': data.Text, 'value': data.Value})
        })
      }
    })
    this.formItem = Object.assign(this.formItem, this.echoData)
    this.formSubmit()
    this.formRef()
    console.log(this.formItem);
  }
}
</script>
<style scoped>
</style>
