if typeof window.localStorage is "undefined" or typeof window.sessionStorage is "undefined"
  (->
    Storage = (type) ->
      createCookie = (name, value, days) ->
        date = undefined
        expires = undefined
        if days
          date = new Date()
          date.setTime date.getTime() + (days * 24 * 60 * 60 * 1000)
          expires = "; expires=" + date.toGMTString()
        else
          expires = ""
        document.cookie = name + "=" + value + expires + "; path=/"
      readCookie = (name) ->
        nameEQ = name + "="
        ca = document.cookie.split(";")
        i = undefined
        c = undefined
        i = 0
        while i < ca.length
          c = ca[i]
          c = c.substring(1, c.length)  while c.charAt(0) is " "
          return c.substring(nameEQ.length, c.length)  if c.indexOf(nameEQ) is 0
          i++
        null
      setData = (data) ->
        data = JSON.stringify(data)
        if type is "session"
          window.name = data
        else
          createCookie "localStorage", data, 365
      clearData = ->
        if type is "session"
          window.name = ""
        else
          createCookie "localStorage", "", 365
      getData = ->
        data = (if type is "session" then window.name else readCookie("localStorage"))
        (if data then JSON.parse(data) else {})
      
      # initialise if there's already data
      data = getData()
      length: 0
      clear: ->
        data = {}
        @length = 0
        clearData()

      getItem: (key) ->
        (if data[key] is `undefined` then null else data[key])

      key: (i) ->
        
        # not perfect, but works
        ctr = 0
        for k of data
          if ctr is i
            return k
          else
            ctr++
        null

      removeItem: (key) ->
        delete data[key]

        @length--
        setData data

      setItem: (key, value) ->
        data[key] = value + "" # forces the value to a string
        @length++
        setData data

    window.localStorage = new Storage("local")  if typeof window.localStorage is "undefined"
    window.sessionStorage = new Storage("session")  if typeof window.sessionStorage is "undefined"
  )()