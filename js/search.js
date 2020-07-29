var searchFunc = function (path, search_id, content_id) {
  // var BTN = "<i id='local-search-close'>✖</i>";
  $.ajax({
    url: path,
    dataType: "xml",
    success: function (xmlResponse) {
      var datas = $("entry", xmlResponse).map(function () {
        return {
          title: $("title", this).text(),
          content: $("content", this).text(),
          url: $("url", this).text()
        };
      }).get();

      var $input = document.getElementById(search_id);
      var $resultContent = document.getElementById(content_id);

      $input.addEventListener('input', function () {
        var str = '<ul class=\"search-result-list\">';
        var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
        $resultContent.innerHTML = "";

        $('#local-search-close').css('display', 'block')
        $('.input-icon.iconfont').css('display', 'none')

        if (this.value.trim().length <= 0) {
          clearSearch()
          return;
        }
        datas.forEach(function (data) {
          var isMatch = true;
          var content_index = [];
          if (!data.title || data.title.trim() === '') {
            data.title = "Untitled";
          }
          var data_title = data.title.trim().toLowerCase();
          var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
          var data_url = data.url;
          var index_title = -1;
          var index_content = -1;
          var first_occur = -1;
          if (data_content !== '') {
            keywords.forEach(function (keyword, i) {
              index_title = data_title.indexOf(keyword);
              index_content = data_content.indexOf(keyword);

              if (index_title < 0 && index_content < 0) {
                isMatch = false;
              } else {
                if (index_content < 0) {
                  index_content = 0;
                }
                if (i == 0) {
                  first_occur = index_content;
                }
              }
            });
          } else {
            isMatch = false;
          }
          if (isMatch) {
            str += "<li><a href='" + data_url + "' class='search-result-title'>" + data_title + "</a>";
            var content = data.content.trim().replace(/<[^>]+>/g, "");
            if (first_occur >= 0) {
              var start = first_occur - 20;
              var end = first_occur + 80;

              if (start < 0) {
                start = 0;
              }

              if (start == 0) {
                end = 100;
              }

              if (end > content.length) {
                end = content.length;
              }

              var match_content = content.substr(start, end);

              keywords.forEach(function (keyword) {
                var regS = new RegExp(keyword, "gi");
                match_content = match_content.replace(regS, "<b class=\"search-keyword\">" + keyword + "</b>");
              });

              str += "<p class=\"search-result\">" + match_content + "...</p>"
            }
            str += "</li>";
          }
        });
        str += "</ul>";
        if (str.indexOf('<li>') === -1) {
          return $resultContent.innerHTML = "<ul><span class='local-search-empty'>没有找到内容，更换下搜索词试试吧~<span></ul>";
          // return $resultContent.innerHTML = BTN + "<ul><span class='local-search-empty'>没有找到内容，更换下搜索词试试吧~<span></ul>";
        }
        $resultContent.innerHTML = str;
        // $resultContent.innerHTML = BTN + str;
        $('#search-result').css('display', 'block')
        $('.lcontent.article-list').css('display', 'none')
        $('.lcontent.tag-list').css('display', 'none')
      });
    }
  });
  $(document).on('click', '#local-search-close', function () {
    $('#local-search-input').val('');
    $('#search-result').html('');
    clearSearch()
  });

  function clearSearch(){
    $('#search-result').css('display', 'none')
    $('#local-search-close').css('display', 'none')
    $('.input-icon.iconfont').css('display', 'block')
    var isTagFilter = $('.lcontent.tag-list').children().length
    if (isTagFilter === 0) {
      $('.lcontent.article-list').css('display', 'block')
    } else {
      $('.lcontent.tag-list').css('display', 'block')
    }
  }
}