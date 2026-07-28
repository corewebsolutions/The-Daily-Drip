query download_vcard verb=GET {
  api_group = "featured_posts_linktree"

  input {
  }

  stack {
    var $vcard {
      value = """
        BEGIN:VCARD
        VERSION:3.0
        FN:Marcela Mastrangelo
        N:Mastrangelo;Marcela;;;
        ORG:Compass Real Estate
        TITLE:Real Estate Broker Associate
        TEL;TYPE=CELL:5618599135
        EMAIL:marcela.mastrangelo@compass.com
        URL:https://www.marcelamastrangelo.com
        END:VCARD
        """
    }
  
    util.set_header {
      value = "Content-Type: text/vcard"
      duplicates = "replace"
    }
  
    util.set_header {
      value = "Content-Disposition: attachment; filename=marcela-mastrangelo.vcf"
      duplicates = "replace"
    }
  }

  response = $vcard
}