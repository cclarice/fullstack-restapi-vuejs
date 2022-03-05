import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

new Vue({
  el: '#app',
  data () {
    return {
      form: {
        name: '',
        value: ''
      },
      contacts: [],
      loading: false
    }
  },
  computed: {
    canCreate () {
      return !!(this.form.value && this.form.name)
    }
  },
  methods: {
    async createContact () {
      const {...contact} = this.form

      const newContact = await request('/api/contacts', 'POST', contact)
      this.contacts.push(newContact)

      this.form.name = this.form.value = ''
    },
    async markContact(id) {
      const contact = this.contacts.find((c) => c.id === id)
      await request(`/api/contacts/${id}`, 'PUT', {
        ...contact,
        marked: true
      })
      if (contact) {
        contact.marked = true
      }
    },
    async removeContact(id) {
      await request(`/api/contacts/${id}`, 'DELETE')
      this.contacts = this.contacts.filter((c) => c.id !== id)
    }
  },
  async mounted () {
    this.loading = true
    const data = await request('/api/contacts')
    this.loading = false
    this.contacts = data
  }
})

async function request(url, method = 'GET', data = null) {
  try {
    const headers = {}
    let body

    if (data) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }

    const response = await fetch(url, {
      method,
      headers,
      body
    })
    return await response.json()
  } catch (e) {
    console.warn('Error:', e.message)
  }
}
