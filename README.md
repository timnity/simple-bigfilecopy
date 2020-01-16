# simple-bigfilecopy
大文件拷贝样例代码

1. basic-copyfile.js

基础文件拷贝，仅适用小文件，超过 2GB 的大文件，就会报错：

```
RangeError [ERR_FS_FILE_TOO_LARGE]: File size (xxxxxxxx) is greater than possible Buffer: 2147483647 bytes
```

因为 Node 的缓冲区大小是2GB。

---

2. stream-copyfile.js

使用 Stream 读取和写入文件，会调用 Buffers。

文档原文：「Stream API (尤其是 stream.pipe() 方法)的一个重要目标是将数据缓冲限制在可接受的水平，这样不同速度的源和目标就不会阻塞可用内存。」

这样我们可以复制 2G 以上的文件。

但是仍然存在两个问题，就是磁盘读写速率是不同步的，也就是可能读 100 MiB/s，写 10 MiB/s。

这个不同步的情况，会造成内存的占用过大，一个 7G 左右的文件会占 4G 左右的内存 RAM。

电脑为了保存读取的数据块，将多余的数据存储到机器的 RAM 中。导致 RAM 出现峰值堵塞，会影响其他程序的运行。

---

3. stream-efficient-copyfile.js

与直接用 Stream 写入流不同，这里改为 `readable.pipe(writeable);`，它控制了磁盘读写速度同步并且不会阻塞内存 RAM。

使用 Pipe（管道），同样 7G 左右的文件，内存占用大约 60M 左右，负载减少了 98% 以上。

如果你愿意多花些时间等待，少占些内存，可以使用 `readable.read(1024xxxx);` 这样的写法来指定缓存块大小。
