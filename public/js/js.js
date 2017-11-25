$(function () {
  // 登录请求
  $('.signin').on('submit', function () {
    var $this = $(this);
    var $submit = $this.children('.btn');
    var $success = $this.children('.alert-success');
    var $danger = $this.children('.alert-danger');

    $.ajax({
      url: '/signin',
      type: 'POST',
      dataType: 'json',
      data: $this.serialize(),
      beforeSend: function () {
        $submit.text('登录中...').attr('disabled', true);
      },
      complete: function () {
        $submit.text('登录').attr('disabled', false);
      },
      success: function (res) {
        if (res.status === 200) {
          window.location.href = '/';
        } else {
          $danger.text(res.message).removeClass('hidden');
        }
      }
    })
    return false;
  })

  // 注册请求
  $('.signup').on('submit', function () {
    var $this = $(this);
    var $submit = $this.children('.btn');
    var $success = $this.children('.alert-success');
    var $danger = $this.children('.alert-danger');

    $.ajax({
      url: '/signup',
      type: 'POST',
      dataType: 'json',
      data: $this.serialize(),
      beforeSend: function () {
        $submit.text('注册中...').attr('disabled', true);
      },
      complete: function () {
        $submit.text('注册').attr('disabled', false);
      },
      success: function (res) {
        if (res.status === 200) {
          $success.text('注册成功!').removeClass('hidden');
        } else {
          $danger.text(res.message).removeClass('hidden');
        }
      }
    })
    return false;
  })

  // 选择主题标签
  $('.article').on('click', '.label-default', function () {
    var value = $(this).text();
    $('.article .label-default').removeClass('label-primary');
    $(this).addClass('label-primary');
    $('.article .article-tag').val(value);
  })

  // 增加标签
  $('.add-tag .label-btn').on('click', function () {
    var $labelInput = $(this).siblings('.label-input');
    var addTagValue = $labelInput.val().trim();
    if (!addTagValue) return false;
    $.ajax({
      url: '/tag/create',
      type: 'POST',
      dataType: 'json',
      data: {
        tag: addTagValue
      },
      beforeSend: function () {
        $(this).val('增加分类...');
      },
      complete: function () {
        $(this).val('增加分类');
      },
      success: function (res) {
        $('.select-tag').append('<span class="label label-default">'+ addTagValue +'</span>');
        $labelInput.val('');
      }
    })
  })

  // 初始化markdown编辑器
  var postEditor = document.getElementById('post-editor');
  if (postEditor) {
    var postTextArea = CodeMirror.fromTextArea(postEditor, {
      mode: 'markdown',
      lineNumbers: true,
      tabSize: 2,
    })
  }

  // 发表文章
  $('.article').on('click', '.article-publish', function () {
    var $this = $(this);
    var $form = $this.closest('.article');
    var $success = $form.children('.alert-success');
    var $danger = $form.children('.alert-danger');
    var $tag = $form.children('.article-tag');

    var textAreaValue = postTextArea.getValue();
    $('#post-editor').val(textAreaValue);

    if ($tag.val() === '') {
      $danger.text('请选择分类').removeClass('hidden');
      return false;
    }

    $.ajax({
      url: '/article/create',
      type: 'POST',
      dataType: 'json',
      data: $form.serialize(),
      beforeSend: function () {
        $this.attr('disabled', true);
      },
      complete: function () {
        $this.attr('disabled', false);
      },
      success: function (res) {
        if (res.status === 200) {
          $success.text('发表成功!').removeClass('hidden');
        } else {
          $danger.text(res.message).removeClass('hidden');
        }
      }
    })
    return false;
  })

  // 主题预览
  $('.article-preview').on('click', function () {
    var $this = $(this);
    var textAreaValue = postTextArea.getValue();
    $.ajax({
      url: '/markdown',
      type: 'POST',
      dataType: 'json',
      data: {
        md: textAreaValue
      },
      beforeSend: function () {
        $this.attr('disabled', true);
      },
      complete: function () {
        $this.attr('disabled', false);
      },
      success: function (res) {
        if (res.status === 200) {
          let content = res.data.content;
          if ($('.markdown-body').length == 0) {
            var $markBody = $('<div class="markdown-body page-module"></div>');
            $('.article').append($markBody);
            $markBody.html(content);
          } else {
            $('.markdown-body').html(content);
          }
        }
      }
    })
  })

  // 文章列表图片占位
  $('.post-list').each(function (el, index) {
    var $this = $(this);
    var $img = $this.find('.img-circle');
    var authorName = $this.find('.author-name').text()[0];
    if (!$img.attr('src')) {
      $img.attr('src', placeholder.getData({text: authorName, color: '#fff', bgcolor: '#333', size: '32x32'}));
    }
  })

  // 个人中心图片占位
  ;(function () {
    var name = $('.user-name').text()[0];
    var $img = $('.user-avatar img');
    if (!$img.attr('src')) {
      $img.attr('src', placeholder.getData({text: name, color: '#fff', bgcolor: '#333', size: '64x64'}))
    }
  })();

})