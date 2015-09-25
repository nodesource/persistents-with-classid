#include <v8.h>
#include <node.h>

#include <set>

using v8::Array;
using v8::Exception;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Handle;
using v8::HandleScope;
using v8::Integer;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Persistent;
using v8::PersistentHandleVisitor;
using v8::String;
using v8::Uint32;
using v8::Value;
using v8::V8;

template <class TypeName>
inline Local<TypeName> PersistentToLocal(Isolate* isolate,
                                         const Persistent<TypeName>* pst) {
  if (pst->IsWeak()) {
    return Local<TypeName>::New(isolate, *pst);
  } else {
    return *reinterpret_cast<Local<TypeName>*>(
        const_cast<Persistent<TypeName>*>(pst));
  }
}

class PersistentHandleWithClassIdVisitor : public PersistentHandleVisitor {
  public:
    PersistentHandleWithClassIdVisitor(
        Isolate* isolate,
        Local<Function> fn,
        Local<Array> class_ids) {
      fn_p_.Reset(isolate, fn);

      // Copy array into a set for faster lookup
      for (uint32_t i = 0; i < class_ids->Length(); ++i) {
        Local<Value> el = class_ids->Get(i);
        if (!el->IsUint32()) {
          Local<String> message =
            String::NewFromUtf8(isolate, "All class_ids need to be uints.");
          isolate->ThrowException(Exception::TypeError(message));
          return;
        }
        class_ids_.insert(static_cast<uint16_t>(el->Uint32Value()));
      }
    };

    ~PersistentHandleWithClassIdVisitor() {
      fn_p_.Reset();
      class_ids_.clear();
    }

    virtual void VisitPersistentHandle(Persistent<Value>* value,
                                       uint16_t class_id) {
      Isolate* isolate = Isolate::GetCurrent();
      HandleScope handle_scope(isolate);
      Local<Function> fn = PersistentToLocal(isolate, &fn_p_).As<Function>();

      // class_id adjustment for AsyncWrap
      if (class_id >= 0xA1C && class_id < 0xA1C + 100)
        class_id = class_id - 0xA1C;

      // ignore all class ids the user isn't interested in
      if (class_ids_.find(class_id) == class_ids_.end())
          return;

      Local<Value> obj = PersistentToLocal(isolate, value);

      if (obj.IsEmpty())
        return;

      Local<Value> argv[] = {
        Integer::New(isolate, class_id),
        obj
      };

      fn->Call(Null(Isolate::GetCurrent()), 2, argv);
    }
  private:
    Persistent<Function> fn_p_;
    std::set<uint16_t> class_ids_;
};

static void Visit(const FunctionCallbackInfo<Value>& info) {
  Isolate* isolate = info.GetIsolate();
  if (!info[0]->IsFunction()) {
    Local<String> message =
      String::NewFromUtf8(isolate, "First argument needs to be a Function");
    isolate->ThrowException(Exception::TypeError(message));
    return;
  }
  if (!info[1]->IsArray()) {
    Local<String> message =
      String::NewFromUtf8(isolate, "Second argument needs to be an Array");
    isolate->ThrowException(Exception::TypeError(message));
    return;
  }

  PersistentHandleWithClassIdVisitor visitor(isolate,
                                             info[0].As<Function>(),
                                             info[1].As<Array>());
  V8::VisitHandlesWithClassIds(isolate, &visitor);
}

static void InitVisitor(Handle<Object> exports) {
  NODE_SET_METHOD(exports, "visit", Visit);
}

NODE_MODULE(persistents_with_classid, InitVisitor)
